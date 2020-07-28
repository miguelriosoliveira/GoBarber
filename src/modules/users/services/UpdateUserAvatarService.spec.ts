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

		const avatarFilename = 'avatar-filename.jpg';
		const userUpdated = await updateUserAvatar.execute({
			userId: user.id,
			avatarFilename,
		});

		expect(userUpdated.avatar).toBe(avatarFilename);
	});

	it('should not allow non authenticated user to change avatar', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeStorageProvider = new FakeStorageProvider();
		const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

		expect(
			updateUserAvatar.execute({
				userId: 'wrong-id',
				avatarFilename: 'avatar-filename.jpg',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should delete old avatar when user uploads new one', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		const fakeStorageProvider = new FakeStorageProvider();
		const updateUserAvatar = new UpdateUserAvatarService(fakeUsersRepository, fakeStorageProvider);

		const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@miguel.com',
			password: '123456',
		});

		const avatar1Filename = 'avatar1.jpg';
		await updateUserAvatar.execute({
			userId: user.id,
			avatarFilename: avatar1Filename,
		});
		const avatar2Filename = 'avatar2.jpg';
		const userUpdated = await updateUserAvatar.execute({
			userId: user.id,
			avatarFilename: avatar2Filename,
		});

		expect(deleteFile).toHaveBeenCalledWith(avatar1Filename);
		expect(userUpdated.avatar).toBe(avatar2Filename);
	});
});
