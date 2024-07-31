import { Module } from '@nestjs/common';
import { BookController } from './application/controllers/book.controller';
import { MemberController } from './application/controllers/member.controller';
import { BookService } from './domain/services/book.service';
import { MemberService } from './domain/services/member.service';
import { BookRepository } from './infrastructure/repositories/book.repository';
import { MemberRepository } from './infrastructure/repositories/member.repository';
import { BorrowService } from './domain/services/borrow.service';
import { BorrowController } from './application/controllers/borrow.controller';
import { BorrowRepository } from './infrastructure/repositories/borrow.repository';

@Module({
  controllers: [
    BorrowController,
    BookController,
    MemberController
  ],
  providers: [
    BorrowService,
    BookService,
    MemberService,
    MemberRepository,
    BookRepository,
    BorrowRepository
  ],
})
export class LibraryModule {}
