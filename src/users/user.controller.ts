import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":email")
  async getUserByEmail(@Param("email") email: string) {
    return this.userService.findByEmail(email);
  }
}
