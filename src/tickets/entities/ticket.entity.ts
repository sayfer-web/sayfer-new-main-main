import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phoneNumber: string;

    @Column()
    investSum: number;

    @Column()
    coverLetter: string;

    @Column({ default: 'pending' })
    status: string;

    @Column()
    createdAt: Date;

    @Column({ nullable: true })
    updatedAt: Date;
    
}
