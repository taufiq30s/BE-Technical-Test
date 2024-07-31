import { Controller, Get } from '@nestjs/common';
import { MemberService } from '../../domain/services/member.service';
import { MemberDto } from '../dto/member.dto';
import { ApiExtraModels, ApiOkResponse, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { ErrorResponseDto, SuccessResponseDto } from '../dto/response.dto';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  @ApiExtraModels(SuccessResponseDto, MemberDto)
  @ApiOperation({ summary: "Show List of Members" })
  @ApiOkResponse({ 
    description: "List of Members",
    schema: {
      allOf: [
        {$ref: getSchemaPath(SuccessResponseDto)},
        {
          type: 'object',
          properties: {
            data: {$ref: getSchemaPath(MemberDto)}
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
  async getMembers(): Promise<SuccessResponseDto<MemberDto> | ErrorResponseDto> {
    try {
      const members = await this.memberService.getMembers();
      return {success: true, data: members}
    } catch (err) {
      return {success: false, message: err.message};
    }
  }
}
