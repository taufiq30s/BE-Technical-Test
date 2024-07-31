import { ApiProperty } from "@nestjs/swagger";

export class MemberDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    number_of_borrowed_books: number;

    constructor(code: string, name: string, number_of_borrowed_books: number) {
        this.code = code;
        this.name = name;
        this.number_of_borrowed_books = number_of_borrowed_books;
    }
}