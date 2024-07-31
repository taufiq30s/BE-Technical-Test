import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { IsString, IsUUID } from "class-validator";
import { BookDto } from "./book.dto";
import { Borrow } from "../../domain/entities/borrow.entity";

export class BorrowRequestDto {
    @ApiProperty()
    @IsString()
    member_code: string;

    @ApiProperty()
    @IsString()
    book_code: string;
}

export class ReturnRequestDto {
    @ApiProperty()
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString()
    member_code: string;
}

@ApiExtraModels(BookDto)
export class BorrowResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    member_code: string;

    @ApiProperty()
    book: BookDto;

    @ApiProperty()
    borrowed_at: string;

    @ApiProperty()
    due_at: string;

    @ApiProperty()
    returned_at?: string;

    constructor(borrow: Borrow) {
        this.id = borrow.id;
        this.member_code = borrow.member.code;
        this.book = new BookDto(
            borrow.book.code,
            borrow.book.title,
            borrow.book.author,
            borrow.book.stock
        );
        this.borrowed_at = borrow.borrowed_at;
        this.due_at = borrow.due_at;
        this.returned_at = borrow.returned_at;
    }
}