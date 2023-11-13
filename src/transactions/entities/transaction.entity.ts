import { User } from "src/users/entities/user.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn()
    public id: number

    @Column({ nullable: true })
    public txid: string

    @Column({ nullable: true })
    public address: string

    @Column({ default: 'transfer' })
    public category: string

    @Column({ nullable: true })
    public sender: string

    @Column({ default: 0 })
    public confirmations: number

    @Column({ nullable: true })
    public receiver: string

    @Column({ default: 'SFR' })
    public tokenType: string

    @Column({ default: 0, type: 'float' })
    public amount: number

    @Column({ default: 1, type: 'float' })
    public exchangeRate: number

    @Column({ default: 'pending' })
    public status: string

    @Column({ nullable: true })
    public errMsg: string

    @Column({ nullable: true })
    public createdAt: Date

    @Column({ nullable: true })
    public successedAt: Date

}
