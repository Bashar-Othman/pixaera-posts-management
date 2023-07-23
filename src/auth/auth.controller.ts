import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import { AuthUser } from "../user/user.decorator";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";
import { SignUp } from "./dto/sign-up.dto";
import { JWTAuthGuard } from "./guards/jwt-auth.guard";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { SessionAuthGuard } from "./guards/session-auth.guard";
import { TokenInterceptor } from "./interceptors/token.interceptor";
import { ApiProperty } from "@nestjs/swagger";
import { Signin } from "./dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TokenInterceptor)
  register(@Body() signUp: SignUp): Promise<User> {
    return this.authService.register(signUp);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(TokenInterceptor)
  async login(@Body() signin: Signin): Promise<any> {
    console.log("email ", signin.email);
    const jwt: string = await this.authService.login(
      signin.email,
      signin.password
    );
    return { token: jwt };
  }

  @Get("/me")
  @UseGuards(SessionAuthGuard, JWTAuthGuard)
  me(@AuthUser() user: User): User {
    return user;
  }
}
