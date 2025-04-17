import { Body, Controller, Post } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto, BulkCreateMembersDto } from './create-member.dto'; // Import BulkCreateMembersDto

@Controller('eventmember')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Post()
  async createBulkMembers(@Body() body: BulkCreateMembersDto) {
    return this.memberService.createMembersWithEvent(body.eventId, body.members, body.userEmail);
  }
}
