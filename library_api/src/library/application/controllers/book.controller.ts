import { Controller, Get } from '@nestjs/common';
import { BookService } from '../../domain/services/book.service';
import { BookDto } from '../dto/book.dto';
import { ApiOkResponse, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto, SuccessResponseDto } from '../dto/response.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  @ApiOperation({ summary: "Show List of Books" })
  @ApiOkResponse({ 
    description: "List of Books",
    schema: {
      allOf: [
        {$ref: getSchemaPath(SuccessResponseDto)},
        {
          type: 'object',
          properties: {
            data: {$ref: getSchemaPath(BookDto)}
          }
        }
      ]
    }
  })
  @ApiResponse({
    status: 500,
    description: "Interal Service Error",
    type: ErrorResponseDto
  })
  async findAll(): Promise<SuccessResponseDto<BookDto> | ErrorResponseDto> {
    try {
      const books = await this.bookService.getBooks();
      return {success: true, data: books};
    } catch (err) {
      return {success: false, message: err.message}
    }
  }
}
