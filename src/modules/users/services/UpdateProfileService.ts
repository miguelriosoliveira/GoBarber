import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
	user_id: string;
	name: string;
	email: string;
	old_password?: string;
	password?: string;
}

@injectable()
export default class UpdateProfileService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) {}

	public async execute({ user_id, name, email, old_password, password }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(user_id);

		if (!user) {
			throw new AppError('User not found!');
		}

		const userUsingDesiredEmail = await this.usersRepository.findByEmail(email);

		if (userUsingDesiredEmail && userUsingDesiredEmail.id !== user_id) {
			throw new AppError('E-mail already in use!');
		}

		if (password) {
			if (!old_password) {
				throw new AppError('To update the password, the old one is required!');
			} else {
				const isOldPasswordCorrect = await this.hashProvider.compareHash(
					old_password,
					user.password,
				);
				if (!isOldPasswordCorrect) {
					throw new AppError('The old password is wrong!');
				}
			}
			user.password = await this.hashProvider.generateHash(password);
		}

		user.name = name;
		user.email = email;

		return this.usersRepository.save(user);
	}
}
