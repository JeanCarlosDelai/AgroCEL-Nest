import * as request from 'supertest';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { CreateUserDto } from 'src/Modules/User/domain/Dto/CreateUserDto';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';

let userId = null;
let token = null;

beforeAll(async () => {
  // Create User
  const createUserDto: CreateUserDto = {
    name: 'teste',
    email: 'teste.teste@teste.com',
    password: 'teste123',
  };

  const responseCreate = await request('http://localhost:4000')
    .post('/users')
    .send(createUserDto);
  console.log(`Response: ${responseCreate.body}`);
  userId = responseCreate.body.id;

  //Login
  const loginDto: LoginDto = {
    email: 'teste.teste@teste.com',
    password: 'teste123',
  };
  const responseLogin = await request('http://localhost:4000')
    .post('/sessions')
    .send(loginDto);
  token = responseLogin.body.token;
});

afterAll(async () => {
  // Delete user
  await request('http://localhost:4000')
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);
});

describe('/POST sessions', () => {
  it('Deve ser possível efetuar o login com sucesso', async () => {
    //Arrange
    const loginData = { email: 'teste.teste@teste.com', password: 'teste123' };
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    //Assert
    const body: UserAuthenticatedInterface = response.body;
    expect(body.token).toBeDefined();
    expect(body.user).toBeDefined();
  });

  it('Não deve ser possível efetuar o login com um usuário não cadastrado', async () => {
    //Arrange
    const loginData = { email: 'teste.teste2@teste.com', password: 'teste123' };
    const HttpStatus401 = 401;
    const Error = 'Unauthorized';
    const ErrorMessage = 'Email ou senha incorretos';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus401);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toBe(ErrorMessage);
  });
});
