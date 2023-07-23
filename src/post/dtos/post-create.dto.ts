import { IsDefined, IsNotEmpty, IsString, MinLength } from "class-validator";
import { Exclude } from "class-transformer";

import { User } from "../../user/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class PostCreate {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  readonly text: string;

  @Exclude()
  owner: User;
}
