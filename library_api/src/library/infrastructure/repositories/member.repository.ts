import { Injectable } from "@nestjs/common";
import { Member } from "../../domain/entities/members.entity";
import { DataSource, IsNull, Not, Repository } from "typeorm";

@Injectable()
export class MemberRepository extends Repository<Member> {
    constructor(private dataSource: DataSource) {
        super(Member, dataSource.createEntityManager())
    }
    
    async getMembers(): Promise<Member[]> {
        return await this.find({
            select: {penaltized_until: false},
            where: {borrows: {returned_at: IsNull()}},
            relations: ['borrows']
        });
    }

    async getUserWithPenaltized(memberCode: string): Promise<Member> {
        return await this.findOne({
            select: {penaltized_until: true},
            where: {
                code: memberCode,
                penaltized_until: Not(IsNull())
            }
        });
    }
}