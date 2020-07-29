import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let fakeMailProvider: FakeMailProvider;
let createUser: CreateUserService;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeUserTokensRepository = new FakeUserTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		fakeMailProvider = new FakeMailProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
			fakeUserTokensRepository,
		);
	});

	it('should be able to send recover email', async () => {
		const email = 'miguel@miguel.com';
		await createUser.execute({
			name: 'Miguel Rios',
			email,
			password: '123456',
		});

		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
		await sendForgotPasswordEmail.execute({ email });

		expect(sendMail).toHaveBeenCalled();
	});

	it('should not allow to recover password of a non existent user', async () => {
		await expect(
			sendForgotPasswordEmail.execute({ email: 'miguel@miguel.com' }),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should generate token for user who had forgotten password', async () => {
		const email = 'miguel@miguel.com';
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email,
			password: '123456',
		});

		const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');
		await sendForgotPasswordEmail.execute({ email });

		expect(generateToken).toHaveBeenCalledWith(user.id);
	});
});
