import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProfileDto {
  userId?: string;

  @MinLength(6, { message: 'O campo nome não pode ter menos que 6 caracteres' })
  @MaxLength(20, {
    message: 'O campo nome não pode ter mais que 20 caracteres',
  })
  @IsString({ message: 'O campo nome deve ser uma string' })
  name?: string;

  @MinLength(6, {
    message: 'O campo email não pode ter menos que 6 caracteres',
  })
  @MaxLength(40, {
    message: 'O campo email não pode ter mais que 40 caracteres',
  })
  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  @IsString({ message: 'O campo email deve ser uma string' })
  email?: string;

  @MinLength(6, {
    message: 'O campo senha não pode ter menos que 6 caracteres',
  })
  @MaxLength(20, {
    message: 'O campo senha não pode ter mais que 20 caracteres',
  })
  @IsString({ message: 'O campo senha deve ser uma string' })
  password?: string;

  @MinLength(6, {
    message: 'O campo senha antiga não pode ter menos que 6 caracteres',
  })
  @MaxLength(20, {
    message: 'O campo senha antiga não pode ter mais que 20 caracteres',
  })
  @IsString({ message: 'O campo senha antiga deve ser uma string' })
  old_password?: string;
}
