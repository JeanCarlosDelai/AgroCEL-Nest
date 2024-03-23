import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio' })
  readonly name: string;

  @IsNotEmpty({ message: 'O campo email não pode estar vazio' })
  @IsEmail({}, { message: 'O campo email deve ser um email válido' })
  readonly email: string;

  @IsNotEmpty({ message: 'O campo password não pode estar vazio' })
  readonly password: string;
}
