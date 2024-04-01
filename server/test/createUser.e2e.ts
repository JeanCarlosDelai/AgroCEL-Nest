import * as request from 'supertest';
import { CreateUserDto } from 'src/Modules/User/domain/Dto/CreateUserDto';
import { LoginDto } from 'src/Modules/User/domain/Dto/LoginDto';

let userId = null;

afterAll(async () => {
  //Login
  const loginDto: LoginDto = {
    email: 'teste.teste@teste.com',
    password: 'teste123',
  };
  const responseLogin = await request('http://localhost:4000')
    .post('/sessions')
    .send(loginDto);
  const token = responseLogin.body.token;
  // Delete user
  await request('http://localhost:4000')
    .delete(`/users/${userId}`)
    .set('Authorization', `Bearer ${token}`);
});

describe('/POST users', () => {
  it('Deve ser possível criar um novo usuário', async () => {
    //Arrange
    const createUserDto: CreateUserDto = {
      name: 'teste123',
      email: 'teste.teste@teste.com',
      password: 'teste123',
    };
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    userId = response.body.id;
    //Assert
    expect(response.body.id).toBeDefined();
  });

  it('Não deve ser possível criar um usuário, que tenha o email já cadastrado', async () => {
    //Arrange
    const createUserDto: CreateUserDto = {
      name: 'teste123',
      email: 'teste.teste@teste.com',
      password: 'teste123',
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'Email já está em uso!';
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toBe(ErrorMessage);
  });

  it('Não deve ser possível criar um usuário com um email inválido', async () => {
    //Arrange
    const createUserDto: CreateUserDto = {
      name: 'teste123',
      email: '12314564',
      password: 'teste123',
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessage = 'O campo email deve ser um email válido';
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessage);
  });

  it('Não deve ser possível efetuar o cadastro de um usuário tendo os dados não sendo strings', async () => {
    //Arrange
    const createUserDto = {
      name: 1234567,
      email: 1234567,
      password: 1234567,
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessageName = 'O campo nome deve ser uma string';
    const ErrorMessageEmail = 'O campo nome deve ser uma string';
    const ErrorMessagePassword = 'O campo nome deve ser uma string';
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessageName);
    expect(responseBody.error.message).toContain(ErrorMessageEmail);
    expect(responseBody.error.message).toContain(ErrorMessagePassword);
  });

  it('Não deve ser possível efetuar o cadastro de um usuário tendos os dados com o tamanho de caracteres menor que o minímo', async () => {
    //Arrange
    const createUserDto: CreateUserDto = {
      name: '123',
      email: '123',
      password: '123',
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessageName = 'O campo nome não pode ter menos que 6 caracteres';
    const ErrorMessageEmail =
      'O campo email não pode ter menos que 6 caracteres';
    const ErrorMessagepassword =
      'O campo senha não pode ter menos que 6 caracteres';
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessageName);
    expect(responseBody.error.message).toContain(ErrorMessageEmail);
    expect(responseBody.error.message).toContain(ErrorMessagepassword);
  });

  it('Não deve ser possível efetuar o cadastro de um usuário tendos os dados com o tamanho de caracteres maior que o máximo', async () => {
    //Arrange
    const createUserDto: CreateUserDto = {
      name: '12345678901234567890123456789',
      email: '12345678901234567890123456789012345678901234567890',
      password: '12345678901234567890123456789',
    };
    const HttpStatus400 = 400;
    const Error = 'Bad Request';
    const ErrorMessageName = 'O campo nome não pode ter mais que 20 caracteres';
    const ErrorMessageEmail =
      'O campo email não pode ter mais que 40 caracteres';
    const ErrorMessagepassword =
      'O campo senha não pode ter mais que 20 caracteres';
    //Act
    const response = await request('http://localhost:4000')
      .post('/users')
      .send(createUserDto);
    const responseBody = JSON.parse(response.text);
    //Assert
    expect(response.status).toBe(HttpStatus400);
    expect(responseBody.error.error).toBe(Error);
    expect(responseBody.error.message).toContain(ErrorMessageName);
    expect(responseBody.error.message).toContain(ErrorMessageEmail);
    expect(responseBody.error.message).toContain(ErrorMessagepassword);
  });
});
