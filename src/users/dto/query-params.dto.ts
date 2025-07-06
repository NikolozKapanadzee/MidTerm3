import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryParamsDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  ageFrom?: number;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  ageTo?: number;
  @IsOptional()
  @IsString()
  fullName?: string;
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  age?: number;
}
