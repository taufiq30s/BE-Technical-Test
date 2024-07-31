import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Borrow } from "./borrow.entity";

@Entity()
export class Member {
    @PrimaryColumn()
    code: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    penaltized_until?: string;

    @OneToMany(() => Borrow, borrow => borrow.member)
    borrows: Borrow[];
}