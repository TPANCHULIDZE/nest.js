import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
  user: UserData;
}

export class UserData {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
