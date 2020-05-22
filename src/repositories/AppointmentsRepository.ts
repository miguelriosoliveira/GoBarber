import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

interface AppointmentProps {
	provider: string;
	date: Date;
}

class AppointmentsRepository {
	private appointments: Appointment[] = [];

	constructor() {
		this.appointments = [];
	}

	public create({ provider, date }: AppointmentProps): Appointment {
		const appointment = new Appointment({ provider, date });
		this.appointments.push(appointment);
		return appointment;
	}

	public findByDate(date: Date): Appointment | null {
		const appointmentFound = this.appointments.find(appointment => isEqual(date, appointment.date));
		return appointmentFound || null;
	}
}

export default AppointmentsRepository;
