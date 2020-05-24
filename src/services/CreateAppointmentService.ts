import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentProps {
	provider: string;
	date: Date;
}

class CreateAppointmentService {
	public async execute({ provider, date }: AppointmentProps): Promise<Appointment> {
		const appointmentsRepository = getCustomRepository(AppointmentsRepository);

		const appointmentDate = startOfHour(date);
		const appointmentInSameDate = await appointmentsRepository.findByDate(appointmentDate);

		if (appointmentInSameDate) {
			throw Error('This appointment is already booked');
		}

		const newAppointment = appointmentsRepository.create({
			provider,
			date: appointmentDate,
		});
		await appointmentsRepository.save(newAppointment);
		return newAppointment;
	}
}

export default CreateAppointmentService;
