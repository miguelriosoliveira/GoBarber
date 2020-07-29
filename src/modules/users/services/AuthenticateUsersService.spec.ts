import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
	it('should be able authenticate an user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

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
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

		await expect(
			authenticateUser.execute({
				email: 'miguel@miguel.com',
				password: '123456',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not authenticate user with wrong email/password combination', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);

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
