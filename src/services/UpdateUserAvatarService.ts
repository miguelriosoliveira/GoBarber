import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import User from '../models/User';

interface Request {
	userId: string;
	avatarFilename: string;
}

class UpdateUserAvatarService {
	public async execute({ userId, avatarFilename }: Request): Promise<User> {
		const userRepository = getRepository(User);
		const user = await userRepository.findOne(userId);

		if (!user) {
			throw new Error('Only authenticated users can change avatar');
		}

		if (user.avatar) {
			const avatarFilePath = path.join(uploadConfig.directory, user.avatar);
			const avatarFileExists = await fs.promises.stat(avatarFilePath);
			if (avatarFileExists) {
				await fs.promises.unlink(avatarFilePath);
			}
		}

		user.avatar = avatarFilename;
		await userRepository.save(user);

		return user;
	}
}

export default UpdateUserAvatarService;
