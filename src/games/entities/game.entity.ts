import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public title: string

    @Column()
    public content: string

    @Column({ nullable: true })
    public coverImages: string

    @Column({ default: 0 })
    public playersQuantity: number

    @Column({ default: new Date().toISOString() })
    public createdAt: Date

    @Column({ nullable: true })
    public updatedAt: Date

}