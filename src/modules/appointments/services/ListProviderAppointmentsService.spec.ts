import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository);
	});

	it("should be able to list provider's appointments of the day", async () => {
		// test params

		const provider_id = 'provider_id';
		const user_id = 'user_id';
		const day = 20;
		const month = 5; // may
		const year = 2020;

		// creating some appointments

		const appointment1 = await fakeAppointmentsRepository.create({
			provider_id,
			user_id,
			date: new Date(year, month - 1, day, 14),
		});

		const appointment2 = await fakeAppointmentsRepository.create({
			provider_id,
			user_id,
			date: new Date(year, month - 1, day, 15),
		});

		// getting provider's appointments of the day

		const appointmentsOfTheDay = await listProviderAppointments.execute({
			provider_id,
			day,
			month,
			year,
		});

		// assertions

		expect(appointmentsOfTheDay).toStrictEqual([appointment1, appointment2]);
	});
});
