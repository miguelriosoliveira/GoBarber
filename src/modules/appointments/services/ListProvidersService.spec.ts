import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';

import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let listProviders: ListProvidersService;

describe('ListProviders', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		listProviders = new ListProvidersService(fakeUsersRepository);
	});

	it('should be able to list providers', async () => {
		const user1 = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: 'senha-rios',
		});
		const user2 = await createUser.execute({
			name: 'Miguel Falabella',
			email: 'miguel@falabella.com',
			password: 'senha-bella',
		});
		const userLogged = await createUser.execute({
			name: 'Miguel Arcanjo',
			email: 'miguel@arcanjo.com',
			password: 'senha-angelical',
		});

		const providers = await listProviders.execute(userLogged.id);

		expect(providers).toStrictEqual([user1, user2]);
	});
});
