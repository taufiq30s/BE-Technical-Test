import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { BookDto } from "./book.dto";
import { MemberDto } from "./member.dto";

@ApiExtraModels(BookDto, MemberDto)
export class SuccessResponseDto<T> {
    @ApiProperty({ default: true })
    success: boolean;

    data: T | string | T[];
}

export class ErrorResponseDto {
    @ApiProperty({ default: false })
    success: boolean;

    @ApiProperty()
    message: string;
}