import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
	});

	it('should be able to update the profile', async () => {
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: '123456',
		});

		const name = 'Miguel Lagos';
		const email = 'miguel@lagos.com';
		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name,
			email,
		});

		expect(updatedUser.name).toBe(name);
		expect(updatedUser.email).toBe(email);
	});

	it('should not allow to update email to existing email', async () => {
		const user1 = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: '123456',
		});

		const user2 = await createUser.execute({
			name: 'Miguel Lagos',
			email: 'miguel@lagos.com',
			password: 'senha123',
		});

		await expect(
			updateProfile.execute({
				user_id: user2.id,
				name: 'Michael Rivers',
				email: user1.email,
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should be able to update the password', async () => {
		const name = 'Miguel Rios';
		const email = 'miguel@rios.com';

		const user = await createUser.execute({
			name,
			email,
			password: '123456',
		});

		const newPassword = 'nova-senha';

		const updatedUser = await updateProfile.execute({
			user_id: user.id,
			name,
			email,
			old_password: user.password,
			password: newPassword,
		});

		expect(updatedUser.name).toBe(name);
		expect(updatedUser.email).toBe(email);
		expect(updatedUser.password).toBe(newPassword);
	});

	it('should not allow to update the password without the old password', async () => {
		const name = 'Miguel Rios';
		const email = 'miguel@rios.com';

		const user = await createUser.execute({
			name,
			email,
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name,
				email,
				password: 'nova-senha',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to update the password with wrong old password', async () => {
		const name = 'Miguel Rios';
		const email = 'miguel@rios.com';

		const user = await createUser.execute({
			name,
			email,
			password: '123456',
		});

		await expect(
			updateProfile.execute({
				user_id: user.id,
				name,
				email,
				old_password: 'wrong-password',
				password: 'nova-senha',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to update the password with wrong old password', async () => {
		await expect(
			updateProfile.execute({
				user_id: 'wrong-id',
				name: 'Miguel Rios',
				email: 'miguel@rios.com',
				old_password: 'old-password',
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});
});
