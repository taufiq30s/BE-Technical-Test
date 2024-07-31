import { ApiProperty } from "@nestjs/swagger";

export class BookDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    author: string;

    @ApiProperty()
    stock: number;

    constructor(
        code: string,
        title: string,
        author: string,
        stock: number
    ) {
        this.code = code;
        this.title = title;
        this.author = author;
        this.stock = stock;
    }
}