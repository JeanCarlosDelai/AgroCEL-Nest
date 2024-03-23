// import {
//   Body,
//   Controller,
//   Get,
//   Param,
//   Post,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { UserService } from '../../Services/user.service';
// import { ValidacaoParametrosPipe } from 'src/common/pipes/validacao-parametros.pipe';

// @Controller('users')
// export class UserController {
//   // eslint-disable-next-line prettier/prettier
//   constructor(private readonly userService: UserService) { }

//   @Get()
//   getHello(): string {
//     return this.userService.getHello();
//   }

//   @Get('/:id')
//   async consultarJogadorPeloId(
//     @Param('id', ValidacaoParametrosPipe) id: string,
//   ): Promise<any> {
//     return id;
//   }

//   @Post()
//   @UsePipes(ValidationPipe)
//   async criarJogador(@Body() criarJogadorDto) {
//     return criarJogadorDto;
//   }
// }
