import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
	it('should be able to create an user', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		const name = 'Miguel Rios';
		const email = 'miguel@miguel.com';
		const password = '123456';
		const user = await createUser.execute({ name, email, password });

		expect(user).toHaveProperty('id');
		expect(user.name).toBe(name);
		expect(user.email).toBe(email);
		expect(user).toHaveProperty('password');
	});

	it('should not allow creante an user with an existent email', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		const email = 'miguel@miguel.com';
		await createUser.execute({
			name: 'Miguel Rios',
			email,
			password: '123456',
		});

		expect(
			createUser.execute({
				name: 'Outro Nome',
				email,
				password: 'different-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
