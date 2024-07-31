import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Member } from "./members.entity";
import { Book } from "./book.entity";

@Entity()
export class Borrow {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => Member, member => member.borrows)
    @JoinColumn({name: 'member_code'})
    member: Member;

    @ManyToOne(() => Book, book => book.borrows)
    @JoinColumn({name: 'book_code'})
    book: Book;

    @Column()
    borrowed_at: string;

    @Column()
    due_at: string;

    @Column({ nullable: true })
    returned_at: string;
}