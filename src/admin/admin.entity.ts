import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryGeneratedColumn()
  eventid: number;

  @Column()
  title: string;

  @Column()
  date: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  image: string;
}