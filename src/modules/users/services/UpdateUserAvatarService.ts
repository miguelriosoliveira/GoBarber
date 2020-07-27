import fs from 'fs';
import path from 'path';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/upload';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IRequest {
	userId: string;
	avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
	constructor(
		@inject('UsersRepository')
		private usersRepository: IUsersRepository,
	) { }

	public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
		const user = await this.usersRepository.findById(userId);

		if (!user) {
			throw new AppError('Only authenticated users can change avatar', 401);
		}

		if (user.avatar) {
			const avatarFilePath = path.join(uploadConfig.directory, user.avatar);
			const avatarFileExists = await fs.promises.stat(avatarFilePath);
			if (avatarFileExists) {
				await fs.promises.unlink(avatarFilePath);
			}
		}

		user.avatar = avatarFilename;
		await this.usersRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
