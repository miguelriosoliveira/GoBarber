import { parseISO } from 'date-fns';
import { Router } from 'express';

import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (_request, response) => {
// 	const allAppointments = await appointmentsRepository.find();
// 	return response.json(allAppointments);
// });

appointmentsRouter.post('/', async (request, response) => {
	const { provider_id, date } = request.body;

	const appointmentsRepository = new AppointmentsRepository();
	const createAppointment = new CreateAppointmentService(appointmentsRepository);

	const parsedDate = parseISO(date);
	const newAppointment = await createAppointment.execute({ provider_id, date: parsedDate });
	return response.json(newAppointment);
});

export default appointmentsRouter;
