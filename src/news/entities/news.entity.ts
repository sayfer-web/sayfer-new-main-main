import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class News {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ })
    public title: string;

    @Column({ })
    public content: string;

    @Column({ nullable: true })
    public subTitle: string;

    @Column({ nullable: true, type: 'text' })
    public coverUrl: string[];

    @Column()
    public createdAt: Date;

    @Column({ nullable: true })
    public updatedAt: Date;
}
