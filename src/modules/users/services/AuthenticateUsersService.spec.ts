import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
	});

	it('should be able authenticate an user', async () => {
		const email = 'miguel@miguel.com';
		const password = '123456';
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email,
			password,
		});
		const response = await authenticateUser.execute({ email, password });

		expect(response).toHaveProperty('token');
		expect(response.user).toBe(user);
	});

	it('should not authenticate unexistent user', async () => {
		await expect(
			authenticateUser.execute({
				email: 'miguel@miguel.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not authenticate user with wrong email/password combination', async () => {
		const email = 'miguel@miguel.com';
		const password = '123456';
		await createUser.execute({
			name: 'Miguel Rios',
			email,
			password,
		});

		await expect(
			authenticateUser.execute({
				email,
				password: 'worng-password',
			}),
		).rejects.toBeInstanceOf(AppError);

		await expect(
			authenticateUser.execute({
				email: 'wrong@email.com',
				password,
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
