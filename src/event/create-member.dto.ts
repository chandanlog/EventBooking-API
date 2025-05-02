export class CreateMemberDto {
    name: string;
    gender: string;
    dob: string;
    idType: string;
    idNumber: string;
    mobile: string;
    createdAt: Date;
  }
  
  export class BulkCreateMembersDto {
    eventId: number;
    members: CreateMemberDto[]; 
    userEmail: string;
    userType: string;
    createdAt: Date;
  }
  