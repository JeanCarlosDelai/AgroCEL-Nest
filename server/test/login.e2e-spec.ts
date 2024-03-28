import * as request from 'supertest';
import { UserAuthenticatedInterface } from 'src/Modules/User/domain/interfaces/login/UserAuthenticated.interface';
import { CreateUserDto } from 'src/Modules/User/domain/Dto/CreateUserDto';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';

let userId = null;
let token = null;

beforeAll(async () => {
  // Create User
  const createUserDto: CreateUserDto = {
    name: 'teste222',
    email: 'teste.teste@teste.com',
    password: 'teste123',
  };

  const responseCreate = await request('http://localhost:4000')
    .post('/users')
    .send(createUserDto);
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
    const body: UserAuthenticatedInterface = response.body;
    //Assert
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

  it('Não deve ser possível efetuar com login com o email vazio', async () => {
    //Arrange
    const loginData = { email: '', password: 'teste123' };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo email não pode estar vazio';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o login com a senha vazia', async () => {
    //Arrange
    const loginData = { email: 'teste.teste2@teste.com', password: '' };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo senha não pode estar vazio';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o login com o email sendo um número', async () => {
    //Arrange
    const loginData = { email: 12345678, password: 'teste123' };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo email deve ser uma string';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o login com a senha sendo um número', async () => {
    //Arrange
    const loginData = { email: 'teste.teste2@teste.com', password: 12345678 };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo senha deve ser uma string';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o login com um email que não seja válido', async () => {
    //Arrange
    const loginData = { email: 'teste.teste', password: 'teste123' };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo email deve ser um email válido';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o login com um email ou senha com menos caracteres que o mínimo', async () => {
    //Arrange
    const loginData = { email: '1@1.c', password: '123' };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessageEmail =
      'O campo email não pode ter menos que 6 caracteres';
    const ErrorMessagepassword =
      'O campo senha não pode ter menos que 6 caracteres';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessageEmail);
    expect(responseBody.error.message).toContain(ErrorMessagepassword);
  });

  it('Não deve ser possível efetuar o login com um email ou senha com mais caracteres que o máximo', async () => {
    //Arrange
    const loginData = {
      email: '1234567890123456789012345678901234567890@gmail.com.br',
      password: '1234567890123465798901',
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessageEmail =
      'O campo email não pode ter mais que 40 caracteres';
    const ErrorMessagepassword =
      'O campo senha não pode ter mais que 20 caracteres';
    //Act
    const response = await request('http://localhost:4000')
      .post('/sessions')
      .send(loginData);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessageEmail);
    expect(responseBody.error.message).toContain(ErrorMessagepassword);
  });
});
