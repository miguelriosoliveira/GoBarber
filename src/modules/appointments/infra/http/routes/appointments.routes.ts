import { celebrate, Segments, Joi } from 'celebrate';
import { Router } from 'express';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();
const appointmentsController = new AppointmentsController();
const providerAppointments = new ProviderAppointmentsController();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post(
	'/',
	celebrate({
		[Segments.BODY]: {
			provider_id: Joi.string().uuid().required(),
			date: Joi.date().required(),
		},
	}),
	appointmentsController.create,
);
appointmentsRouter.get(
	'/me',
	celebrate({
		[Segments.QUERY]: {
			day: Joi.number().min(1).max(31).required(),
			month: Joi.number().min(1).max(12).required(),
			year: Joi.number().min(1900).required(),
		},
	}),
	providerAppointments.index,
);

export default appointmentsRouter;
