import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../infrastructure/repositories/book.repository';
import { BorrowRepository } from '../../infrastructure/repositories/borrow.repository';
import { DataSource } from 'typeorm';
import { Borrow } from '../entities/borrow.entity';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { v4 as uuidv4 } from 'uuid';
import { BorrowResponseDto } from '../../application/dto/borrow.dto';

@Injectable()
export class BorrowService {
    constructor(
        private readonly borrowRepository: BorrowRepository,
        private readonly bookRepository: BookRepository,
        private readonly memberRepository: MemberRepository,
        private dataSource: DataSource
    ) {}

    async checkPenaltized(memberCode: string): Promise<boolean> {
        const user = await this.memberRepository.getUserWithPenaltized(memberCode);
        if (!user) {
            return false;
        }
        
        // Remove Penaltized if more than 3 days
        if (new Date() > new Date(Date.parse(user.penaltized_until))) {
            await this.memberRepository.update({code: memberCode}, {penaltized_until: null});
            return false;
        }
        return true;
    }

    async create(memberCode: string, bookCode: string): Promise<BorrowResponseDto> {
        try {
            const member = await this.memberRepository.findOne({where: {code: memberCode}});
            if (!member) {
                throw new Error("Member Not Found!");
            }
            if (await this.checkPenaltized(memberCode)) {
                throw new Error("This member have been penaltized!");
            }
            if (await this.borrowRepository.countBorrowed(memberCode) >= 2) {
                throw new Error("Borrowed books Limit Exceed");
            }
            return await this.dataSource.transaction(async manager => {
                // Validate member and book code
                const book = await this.bookRepository.findOne({where: {code: bookCode}});
                if (!book) {
                    throw new Error("Book Not Found!");
                }
                if (book.stock < 1) {
                    throw new Error("Book out of stock");
                }

                // Store borrow data and decrease stock
                const borrow = new Borrow();
                const currentDate = new Date();
                borrow.id = uuidv4();
                borrow.book = book;
                borrow.member = member;
                borrow.borrowed_at = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                borrow.due_at = new Date(currentDate.setDate(currentDate.getDate() + 7)).toISOString().slice(0, 19).replace('T', ' ');

                const borrow_response = await manager.save(borrow);
                
                book.stock--;
                await manager.save(book);

                return new BorrowResponseDto(borrow_response);
            });
        } catch (err) {
            throw err;
        }
    }

    async return (id: string, memberCode: string): Promise<BorrowResponseDto> {
        try {
            return await this.dataSource.transaction(async manager => {
                const borrow = await this.borrowRepository.getBorrow(id, memberCode);
                if (!borrow) {
                    throw new Error("Borrow Not Found!");
                }
                if (borrow.returned_at != null) {
                    throw new Error("Book was returned!");
                }

                const currentDate = new Date();
                borrow.returned_at = currentDate.toISOString().slice(0, 19).replace('T', ' ');
                const borrow_response = await manager.save(borrow);

                const book = borrow.book;
                book.stock++;
                await manager.save(book);

                if (currentDate > new Date(Date.parse(borrow.due_at))) {
                    const member = borrow.member;
                    member.penaltized_until = new Date(
                        currentDate.setDate(currentDate.getDate() + 3))
                        .toISOString().slice(0, 19).replace('T', ' ');
                    await manager.save(member);
                }

                return new BorrowResponseDto(borrow_response);
            });
        } catch (err) {
            throw err;
        }
    }
}
