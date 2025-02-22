import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/users/enums/role.enum';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ unique: true })
    public username: string;

    @Column({})
    public password: string;

    @Column({ nullable: true })
    public phoneNumber: string;

    @Column({ nullable: true })
    public email: string;

    @Column({ nullable: true })
    public referrer: string;

    @Column("text", { array: true, default: [] })
    public referrals: string[];

    // @Column({ array: true,  })
    // public roles: string;

    @Column("text", { array: true, default: ['user'] })
    public roles: string[];

    @Column({ default: '0', type: 'float' })
    public tokenBalanceSFR: number;

    @Column({ default: 0 })
    public tokenBalanceSFRX: number;

    @Column({ default: 0 })
    public isBanned: number

    @Column({ default: 'Bronze' })
    public contractStatus: string

    @Exclude()
    public currentHashedRefreshToken?: string;

    // ...
}