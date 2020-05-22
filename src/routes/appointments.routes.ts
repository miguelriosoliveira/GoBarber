import { startOfHour, parseISO } from 'date-fns';
import { Router } from 'express';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body;

	const parsedDate = startOfHour(parseISO(date));
	const appointmentInSameDate = appointmentsRepository.findByDate(parsedDate);

	if (appointmentInSameDate) {
		return response.status(400).json({ message: 'This appointment is already booked' });
	}

	const newAppointment = appointmentsRepository.create({ provider, date: parsedDate });
	return response.json(newAppointment);
});

appointmentsRouter.get('/', (request, response) => {
	const allAppointments = appointmentsRepository.all();
	return response.json(allAppointments);
});

export default appointmentsRouter;
