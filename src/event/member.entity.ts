import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;
 
  @Column()
  userEmail: string;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  dob: string;

  @Column()
  idType: string;

  @Column()
  idNumber: string;

  @Column()
  mobile: string;

  @Column()
  eventId: number;

  @Column()
  userType: string;
  
  @CreateDateColumn() 
  createdAt: Date;
  
}
