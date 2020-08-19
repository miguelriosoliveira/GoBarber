import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ProfileController from '@modules/users/infra/http/controllers/ProfileController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);
profileRouter.put(
	'/',
	celebrate({
		[Segments.BODY]: Joi.object({
			name: Joi.string().required(),
			email: Joi.string().email().required(),
			old_password: Joi.string(),
			password: Joi.string(),
			password_confirmation: Joi.string().valid(Joi.ref('password')),
		})
			.with('old_password', 'password')
			.with('password', 'old_password')
			.with('password', 'password_confirmation'),
	}),
	profileController.update,
);

export default profileRouter;
