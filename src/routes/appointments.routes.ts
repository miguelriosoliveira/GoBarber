import { parseISO } from 'date-fns';
import { Router } from 'express';

import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
	const allAppointments = appointmentsRepository.all();
	return response.json(allAppointments);
});

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body;

	const parsedDate = parseISO(date);
	const createService = new CreateAppointmentService(appointmentsRepository);

	try {
		const newAppointment = createService.execute({ provider, date: parsedDate });
		return response.json(newAppointment);
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

export default appointmentsRouter;
