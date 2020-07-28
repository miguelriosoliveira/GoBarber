import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
	it('should be able to update an user avatar', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const fakeStorageProvider = new FakeStorageProvider();
		const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@miguel.com',
			password: '123456',
		});

		const userUpdated = await updateUserAvatar.execute({
			userId: user.id,
			avatarFilename: '',
		});

		// expect(user).toHaveProperty('id');
		// expect(user.name).toBe(name);
		// expect(user.email).toBe(email);
		// expect(user).toHaveProperty('password');
	});
});
