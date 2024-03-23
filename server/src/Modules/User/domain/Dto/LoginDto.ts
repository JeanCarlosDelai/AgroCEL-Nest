import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  @IsString({ message: 'O campo email deve ser uma string' })
  readonly email: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  @IsString({ message: 'O campo senha deve ser uma string' })
  readonly password: string;
}
