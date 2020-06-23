import { parseISO } from 'date-fns';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get('/', async (_request, response) => {
	const appointmentsRepository = getCustomRepository(AppointmentsRepository);
	const allAppointments = await appointmentsRepository.find();
	return response.json(allAppointments);
});

appointmentsRouter.post('/', async (request, response) => {
	const { provider_id, date } = request.body;

	const parsedDate = parseISO(date);
	const createAppointment = new CreateAppointmentService();

	const newAppointment = await createAppointment.execute({ provider_id, date: parsedDate });
	return response.json(newAppointment);
});

export default appointmentsRouter;
