import { Injectable } from "@nestjs/common";
import { Borrow } from "../../domain/entities/borrow.entity";
import { DataSource, IsNull, Repository } from "typeorm";

@Injectable()
export class BorrowRepository extends Repository<Borrow> {
    constructor(private dataSource: DataSource) {
        super(Borrow, dataSource.createEntityManager())
    }

    async countBorrowed(memberCode: string): Promise<number> {
        return await this.count({
            where: {
                member: {
                    code: memberCode,
                },
                returned_at: IsNull()
            }
        });
    }

    async getBorrow(id: string, memberCode: string): Promise<Borrow> {
        return await this.findOne({
            where: {
                id: id,
                member: {code: memberCode}
            },
            relations: ['book', 'member']
        });
    }
}