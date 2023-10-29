import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    public id: number

    @Column({ default: 0 })
    public senderId: number

    @Column({ default: 0 })
    public receiverId: number

    @Column({ default: 'transfer' })
    public type: string

    @Column({ default: 'SFR' })
    public tokenType: string

    @Column({ default: 0 })
    public tokenQuantity: string

    @Column({ default: 1 })
    public exchangeRate: string

    @Column({ default: 'pending' })
    public status: string

    @Column({ nullable: true })
    public errMsg: string

    @Column({ nullable: true })
    public createdAt: Date

    @Column({ nullable: true })
    public successedAt: Date

}
