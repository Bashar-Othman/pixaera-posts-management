import {
  IsDefined,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Validate,
} from "class-validator";
import { IsUserAlreadyExist } from "../../user/is-user-already-exist.validator";
import { ApiProperty } from "@nestjs/swagger";

export class SignUp {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsDefined()
  @IsEmail()
  @Validate(IsUserAlreadyExist)
  @ApiProperty()
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty()
  readonly password: string;
}
