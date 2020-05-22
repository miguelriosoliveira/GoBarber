import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

interface AppointmentProps {
	provider: string;
	date: Date;
}

class CreateAppointmentService {
	private appointmentsRepository: AppointmentsRepository;

	constructor(appointmentsRepository: AppointmentsRepository) {
		this.appointmentsRepository = appointmentsRepository;
	}

	public execute({ provider, date }: AppointmentProps): Appointment {
		const appointmentDate = startOfHour(date);
		const appointmentInSameDate = this.appointmentsRepository.findByDate(appointmentDate);

		if (appointmentInSameDate) {
			throw Error('This appointment is already booked');
		}

		const newAppointment = this.appointmentsRepository.create({ provider, date: appointmentDate });
		return newAppointment;
	}
}

export default CreateAppointmentService;
