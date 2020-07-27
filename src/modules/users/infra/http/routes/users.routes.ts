import { Router } from 'express';
import multer from 'multer';
import { container } from 'tsyringe';

import uploadConfig from '@config/upload';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
	const { name, email, password } = request.body;

	const createUser = container.resolve(CreateUserService);
	const newUser = await createUser.execute({ name, email, password });

	delete newUser.password;

	return response.json(newUser);
});

usersRouter.patch(
	'/avatar',
	ensureAuthenticated,
	upload.single('avatar'),
	async (request, response) => {
		const updateUserAvatar = container.resolve(UpdateUserAvatarService);
		const user = await updateUserAvatar.execute({
			userId: request.user.id,
			avatarFilename: request.file.filename,
		});

		delete user.password;

		return response.json(user);
	},
);

export default usersRouter;
