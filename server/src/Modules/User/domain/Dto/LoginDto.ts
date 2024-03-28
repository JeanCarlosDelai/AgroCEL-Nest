import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @MinLength(6, {
    message: 'O campo email não pode ter menos que 6 caracteres',
  })
  @MaxLength(40, {
    message: 'O campo email não pode ter mais que 40 caracteres',
  })
  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  @IsString({ message: 'O campo email deve ser uma string' })
  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  readonly email: string;

  @MinLength(6, {
    message: 'O campo senha não pode ter menos que 6 caracteres',
  })
  @MaxLength(20, {
    message: 'O campo senha não pode ter mais que 20 caracteres',
  })
  @IsString({ message: 'O campo senha deve ser uma string' })
  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  readonly password: string;
}
