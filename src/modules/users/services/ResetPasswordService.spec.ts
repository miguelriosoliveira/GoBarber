import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import CreateUserService from './CreateUserService';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let resetPasswordService: ResetPasswordService;

describe('ResetPassword', () => {
	beforeEach(() => {
		fakeUsersRepository = new FakeUsersRepository();
		fakeUserTokensRepository = new FakeUserTokensRepository();
		fakeHashProvider = new FakeHashProvider();
		createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
		resetPasswordService = new ResetPasswordService(
			fakeUsersRepository,
			fakeUserTokensRepository,
			fakeHashProvider,
		);
	});

	it('should be able to reset password', async () => {
		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: '123456',
		});

		const { token } = await fakeUserTokensRepository.generate(user.id);

		const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

		const newPassword = 'new-password';
		await resetPasswordService.execute({
			token,
			password: newPassword,
		});

		const updatedUser = await fakeUsersRepository.findById(user.id);

		expect(generateHash).toHaveBeenCalledWith(newPassword);
		expect(updatedUser?.password).toBe(newPassword);
	});

	it('should not allow to reset password with non-existent token', async () => {
		await expect(
			resetPasswordService.execute({
				token: 'non-existent-tken',
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to reset password with non-existent user', async () => {
		const { token } = await fakeUserTokensRepository.generate('non-existing-user');

		await expect(
			resetPasswordService.execute({
				token,
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);
	});

	it('should not allow to reset password with expired token (after 2 hours)', async () => {
		const oldPassword = 'old-password';

		const user = await createUser.execute({
			name: 'Miguel Rios',
			email: 'miguel@rios.com',
			password: oldPassword,
		});

		const { token } = await fakeUserTokensRepository.generate(user.id);

		jest.spyOn(Date, 'now').mockImplementationOnce(() => {
			const customDate = new Date();
			return customDate.setHours(customDate.getHours() + 3);
		});

		await expect(
			resetPasswordService.execute({
				token,
				password: 'new-password',
			}),
		).rejects.toBeInstanceOf(AppError);

		expect(user.password).toBe(oldPassword);
	});
});
