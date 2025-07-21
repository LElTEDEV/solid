import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { ValidadeCheckInUseCase } from "./validate-check-in-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidadeCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidadeCheckInUseCase(checkInRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate a check-in by its id", async () => {
    const checkIn = await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await sut.execute({ checkInId: checkIn.id });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInRepository.checkIns[0].validated_at).toEqual(
      expect.any(Date)
    );
  });

  it("should not be able to validate a check-in with the wrong id", async () => {
    await checkInRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    expect(async () => {
      await sut.execute({
        checkInId: "2985925",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date(2025, 0, 1, 13, 40));

    const createdCheckIn = await checkInRepository.create({
      gym_id: "gym-01",
      user_id: "user-01",
    });

    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    expect(async () => {
      await sut.execute({
        checkInId: createdCheckIn.id,
      });
    }).rejects.instanceOf(LateCheckInValidationError);
  });
});
