import { Injectable } from '@nestjs/common';
import { BookDto } from '../../application/dto/book.dto';
import { BookRepository } from '../../infrastructure/repositories/book.repository';

@Injectable()
export class BookService {
    constructor(
        private readonly bookRepository: BookRepository
    ) {}

    async getBooks(): Promise<BookDto[]> {
        try {
            let datas = await this.bookRepository.getBooks();
            let res: BookDto[] = [];
            datas.forEach((data) => {
                res.push(new BookDto(
                    data.code,
                    data.title,
                    data.author,
                    data.stock
                ))
            });
            return res;
        } catch (err) {
            throw err;
        }
    }
}
