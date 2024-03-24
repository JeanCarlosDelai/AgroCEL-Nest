import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio' })
  @IsString({ message: 'O campo nome deve ser uma string' })
  readonly name: string;

  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  @IsString({ message: 'O campo email deve ser uma string' })
  readonly email: string;

  @IsNotEmpty({ message: 'O campo senha não pode estar vazio' })
  @IsString({ message: 'O campo senha deve ser uma string' })
  password: string;
}
