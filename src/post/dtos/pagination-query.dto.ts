import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional, IsPositive, Max } from "class-validator";

export class PaginationQuery {
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value as string))
  @IsPositive()
  @Max(100)
  @ApiProperty()
  readonly limit = 10;

  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value as string))
  @IsPositive()
  @ApiProperty()
  readonly page = 1;

  get offset() {
    return (this.page - 1) * this.limit;
  }
}
