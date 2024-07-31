import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../../infrastructure/repositories/member.repository';
import { MemberDto } from '../../application/dto/member.dto';

@Injectable()
export class MemberService {
    constructor(
        private readonly memberRepository: MemberRepository
    ) {}
    
    async getMembers(): Promise<MemberDto[]> {
        try {
            let datas = await this.memberRepository.getMembers();
            let res: MemberDto[] = [];
            datas.forEach((data) => {
                res.push(new MemberDto(data.code, data.name, data.borrows.length))
            });
            return res;
        } catch (err) {
            throw err;
        }
    }
}
