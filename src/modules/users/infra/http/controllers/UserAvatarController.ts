import { classToClass } from 'class-transformer';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarController {
	public async update(request: Request, response: Response): Promise<Response> {
		const userId = request.user.id;
		const avatarFilename = request.file.filename;

		const updateUserAvatar = container.resolve(UpdateUserAvatarService);
		const user = await updateUserAvatar.execute({ userId, avatarFilename });

		return response.json(classToClass(user));
	}
}
