import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';
import ProvidersController from '@modules/appointments/infra/http/controllers/ProvidersController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const providersRouter = Router();

const providersController = new ProvidersController();
const providerMonthAvailabilityController = new ProviderMonthAvailabilityController();
const providerDayAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticated);

providersRouter.get('/', providersController.index);
providersRouter.get(
	'/:provider_id/month-availability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
		[Segments.QUERY]: {
			month: Joi.number().min(1).max(12).required(),
			year: Joi.number().min(1900).required(),
		},
	}),
	providerMonthAvailabilityController.index,
);
providersRouter.get(
	'/:provider_id/day-availability',
	celebrate({
		[Segments.PARAMS]: {
			provider_id: Joi.string().uuid().required(),
		},
		[Segments.QUERY]: {
			day: Joi.number().min(1).max(31).required(),
			month: Joi.number().min(1).max(12).required(),
			year: Joi.number().min(1900).required(),
		},
	}),
	providerDayAvailabilityController.index,
);

export default providersRouter;
