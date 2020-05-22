import { uuid } from 'uuidv4';

interface AppointmentProps {
	provider: string;
	date: Date;
}

class Appointment {
	id: string;

	provider: string;

	date: Date;

	constructor({ provider, date }: AppointmentProps) {
		this.id = uuid();
		this.provider = provider;
		this.date = date;
	}
}

export default Appointment;
