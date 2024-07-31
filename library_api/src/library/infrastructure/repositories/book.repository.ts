import { Injectable } from "@nestjs/common";
import { Book } from "../../domain/entities/book.entity";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class BookRepository extends Repository<Book> {
    constructor(private dataSource: DataSource) {
        super(Book, dataSource.createEntityManager())
    }

    async getBooks(): Promise<Book[]> {
        return await this.find({select: {borrows: false}});
    }
}