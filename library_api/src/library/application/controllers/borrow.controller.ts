import { Body, Controller, Post } from '@nestjs/common';
import { BorrowService } from '../../domain/services/borrow.service';
import { BorrowRequestDto, BorrowResponseDto, ReturnRequestDto } from '../dto/borrow.dto';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto, SuccessResponseDto } from '../dto/response.dto';

@Controller('borrows')
export class BorrowController {
  constructor(
    private readonly borrowService: BorrowService
  ) {}

  @Post()
  @ApiExtraModels(SuccessResponseDto, BorrowResponseDto)
  @ApiOperation({ summary: "Store Record of Book Borrowing" })
  @ApiOkResponse({ 
    description: "Created Succesfully",
    schema: {
      allOf: [
        {$ref: getSchemaPath(SuccessResponseDto)},
        {
          type: 'object',
          properties: {
            data: {$ref: getSchemaPath(BorrowResponseDto)}
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
  async create(@Body() body: BorrowRequestDto): Promise<SuccessResponseDto<BorrowResponseDto> | ErrorResponseDto> {
    try {
      const borrow = await this.borrowService.create(body.member_code, body.book_code);
      return {success: true, data: borrow};
    } catch (err) {
      return {success: false, message: err.message};
    }
  }

  @Post('return')
  @ApiExtraModels(SuccessResponseDto, BorrowResponseDto)
  @ApiOperation({ summary: "Store Record of Book Return" })
  @ApiOkResponse({ 
    description: "Created Succesfully",
    schema: {
      allOf: [
        {$ref: getSchemaPath(SuccessResponseDto)},
        {
          type: 'object',
          properties: {
            data: {$ref: getSchemaPath(BorrowResponseDto)}
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
  async return(@Body() body: ReturnRequestDto): Promise<SuccessResponseDto<BorrowResponseDto> | ErrorResponseDto> {
    try {
      const borrow = await this.borrowService.return(body.id, body.member_code);
      return {success: true, data: borrow};
    } catch (err) {
      return {success: false, message: err.message};
    }
  }
}
