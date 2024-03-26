import { IsEmail, IsString } from 'class-validator';

export class UpdateProfileDto {
  userId?: string;

  @IsString({ message: 'O campo nome deve ser uma string' })
  name?: string;

  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  @IsString({ message: 'O campo email deve ser uma string' })
  email?: string;

  @IsString({ message: 'O campo senha deve ser uma string' })
  password?: string;

  @IsString({ message: 'O campo senha antiga deve ser uma string' })
  old_password?: string;
}
