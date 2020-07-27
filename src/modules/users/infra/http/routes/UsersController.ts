import { parseISO } from 'date-fns';
import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UsersController {
	public async create(request: Request, response: Response): Promise<Response> {
		const { name, email, password } = request.body;

		const createUser = container.resolve(CreateUserService);
		const newUser = await createUser.execute({ name, email, password });

		delete newUser.password;

		return response.json(newUser);
	}

	public async updateAvatar(request: Request, response: Response): Promise<Response> {
		const updateUserAvatar = container.resolve(UpdateUserAvatarService);
		const user = await updateUserAvatar.execute({
			userId: request.user.id,
			avatarFilename: request.file.filename,
		});

		delete user.password;

		return response.json(user);
	}
}
