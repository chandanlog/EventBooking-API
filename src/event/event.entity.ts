//import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';


@Entity('event')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userEmail: string;

  @Column()
  userType: string;

  @Column()
  eventName: string;

  @Column()
  eventDate: string;

  @Column()
  eventLoaction: string;

  @Column()
  eventId: number;

  @Column()
  numSeats: number;

  @Column({ nullable: true })
  modeOfTravel: string;

  @Column({ nullable: true })
  vehicleDetails: string;

  @Column()
  addressLine: string;

  @Column()
  state: string;

  @Column()
  district: string;

  @Column()
  pincode: string;

  @Column()
  country: string;

  @Column()
  idType: string;

  @Column()
  idNumber: string;
}
