import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';

import ListProviderMonthAvailabityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailability: ListProviderMonthAvailabityService;

describe('ListProviderMonthAvailability', () => {
	beforeEach(() => {
		fakeAppointmentsRepository = new FakeAppointmentsRepository();
		listProviderMonthAvailability = new ListProviderMonthAvailabityService(
			fakeAppointmentsRepository,
		);
	});

	it('should be able to list month availability of a provider', async () => {
		// test params

		const provider_id = 'provider_id';
		const day = 20;
		const month = 5; // may
		const year = 2020;

		// filling the day with appointments

		const workingHours = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

		await Promise.all(
			workingHours.map(hour => {
				return fakeAppointmentsRepository.create({
					provider_id,
					date: new Date(year, month - 1, day, hour),
				});
			}),
		);

		// getting provider's availability

		const availability = await listProviderMonthAvailability.execute({ provider_id, month, year });

		// assertions

		expect(availability).toStrictEqual(
			expect.arrayContaining([
				{ day: 19, available: true },
				{ day: 20, available: false },
				{ day: 21, available: true },
			]),
		);
	});
});
