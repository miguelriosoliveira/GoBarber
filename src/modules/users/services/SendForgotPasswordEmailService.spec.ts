import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';

import CreateUserService from './CreateUserService';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

describe('SendForgotPasswordEmail', () => {
	it('should be able to recover password by email', async () => {
		const fakeUsersRepository = new FakeUsersRepository();
		const fakeHashProvider = new FakeHashProvider();
		const fakeMailProvider = new FakeMailProvider();
		const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

		const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

		const email = 'miguel@miguel.com';
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email,
			password: '123456',
		});
		const sendForgotPasswordEmail = new SendForgotPasswordEmailService(
			fakeUsersRepository,
			fakeMailProvider,
		);

		await sendForgotPasswordEmail.execute({ email });

		expect(sendMail).toHaveBeenCalled();
	});
});
