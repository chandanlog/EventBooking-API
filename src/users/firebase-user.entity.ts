import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('FirebaseUser')
export class FirebaseUser {
  @PrimaryGeneratedColumn()
  id: number;

  // Identifier (email)
  @Column({ unique: true })
  identifier: string;

  // Comma-separated list of providers (e.g., 'google.com')
  @Column()
  providers: string;

  // Firebase account creation date (YYYY-MM-DD)
  @Column({ type: 'date' })
  created: string;

  // Firebase last sign-in date (YYYY-MM-DD)
  @Column({ type: 'date' })
  signedIn: string;

  // Firebase UID
  @Column({ unique: true })
  userUID: string;

  // Google Display Name
  @Column()
  userName: string;

  // Profile photo URL
  @Column({ type: 'text', nullable: true })
  photoURL: string;

  // Server record creation time
  @CreateDateColumn()
  createdAt: Date;
}
