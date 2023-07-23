import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MinLength,
  IsBoolean,
} from "class-validator";
import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class PostUpdate {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @ApiProperty()
  readonly text?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  @Transform(({ value }) =>
    typeof value === "string"
      ? ["true", "1", "yes"].includes(value.toLowerCase())
      : Boolean(value)
  )
  @ApiProperty()
  readonly is_active?: boolean;
}
