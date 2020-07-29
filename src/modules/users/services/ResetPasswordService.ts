import { differenceInHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

interface IRequest {
	token: string;
	password: string;
}

@injectable()
class ResetPasswordService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,

		@inject('UserTokensRepository')
		private userTokensRepository: IUserTokensRepository,

		@inject('HashProvider')
		private hashProvider: IHashProvider,
	) { }

	public async execute({ token, password }: IRequest): Promise<void> {
		const userToken = await this.userTokensRepository.findByToken(token);

		if (!userToken) {
			throw new AppError('User token not found!');
		}

		if (differenceInHours(Date.now(), userToken.created_at) > 2) {
			throw new AppError('User token expired!');
		}

		const user = await this.usersRepository.findById(userToken.user_id);

		if (!user) {
			throw new AppError('User not found!');
		}

		user.password = await this.hashProvider.generateHash(password);
		await this.usersRepository.save(user);
	}
}

export default ResetPasswordService;
