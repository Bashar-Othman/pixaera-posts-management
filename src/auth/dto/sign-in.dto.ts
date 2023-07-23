import { IsDefined, IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class Signin {
  @IsDefined()
  @IsEmail()
  @ApiProperty()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  readonly password: string;
}
