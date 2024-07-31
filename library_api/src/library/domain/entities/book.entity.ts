import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { Borrow } from "./borrow.entity";

@Entity()
export class Book {
    @PrimaryColumn()
    code: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    stock: number;

    @OneToMany(() => Borrow, borrow => borrow.book)
    borrows?: Borrow[];
}