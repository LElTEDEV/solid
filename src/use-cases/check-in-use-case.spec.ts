import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { CheckInUseCase } from "./check-in-use-case";
import { Decimal } from "@prisma/client/runtime/library";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIns Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    gymsRepository.gyms.push({
      id: "gym-01",
      title: "JavaScript GYM",
      description: "",
      phone: "",
      latitude: new Decimal(-22.596979401281697),
      longitude: new Decimal(-46.527237581434086),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.596979401281697,
      userLongitude: -46.527237581434086,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
      userLatitude: -22.596979401281697,
      userLongitude: -46.527237581434086,
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
        userLatitude: -22.596979401281697,
        userLongitude: -46.527237581434086,
      });
    }).rejects.instanceOf(Error);
  });

  it("should be able to check in twice but in different day", async () => {
    vi.setSystemTime(new Date(2025, 1, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.596979401281697,
      userLongitude: -46.527237581434086,
    });

    vi.setSystemTime(new Date(2025, 1, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
      userLatitude: -22.596979401281697,
      userLongitude: -46.527237581434086,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.gyms.push({
      id: "gym-02",
      title: "SkyFit GYM",
      description: "SkyFit GYM",
      phone: "",
      latitude: new Decimal(-22.597034269568187),
      longitude: new Decimal(-46.52777271671778),
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-02",
        userLatitude: -22.55647798489424,
        userLongitude: -46.67491960287818,
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
