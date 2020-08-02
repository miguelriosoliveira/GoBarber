import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		showProfile = new ShowProfileService(fakeUsersRepository);
	});

	it('should be able to show the profile', async () => {
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: '123456',
		});

		const profile = await showProfile.execute(user.id);

		expect(profile.name).toBe(user.name);
		expect(profile.email).toBe(user.email);
	});

	it('should not allow to show the profile of non existent user', async () => {
		await expect(showProfile.execute('non-existent-id')).rejects.toBeInstanceOf(AppError);
	});
});
