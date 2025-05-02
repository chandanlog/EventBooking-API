import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { CreateMemberDto } from './create-member.dto';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  async createMembersWithEvent(eventId: number, members: CreateMemberDto[], userEmail: string, userType: string): Promise<Member[]> {
    const membersWithEvent = members.map(member => ({
      ...member,
      eventId,
      userEmail,
      userType,
      createdAt: new Date(),
    }));
  
    const created = this.memberRepository.create(membersWithEvent);
    return await this.memberRepository.save(created);
  }
  
}
