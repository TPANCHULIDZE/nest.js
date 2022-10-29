import { IsEmail, IsOptional, IsString } from 'class-validator';

export class DtoData {
  user: UpdateUserData;
}

export class UpdateUserData {
  @IsEmail()
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
}
