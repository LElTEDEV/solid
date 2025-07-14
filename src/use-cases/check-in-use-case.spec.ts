import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";

import { CheckInUseCase } from "./check-in-use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("CheckIns Use Case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInsRepository);

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));

    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(async () => {
      await sut.execute({
        userId: "user-01",
        gymId: "gym-01",
      });
    }).rejects.instanceOf(Error);
  });

  it("should be able to check in twice but in different day", async () => {
    vi.setSystemTime(new Date(2025, 1, 20, 8, 0, 0));

    await sut.execute({ gymId: "gym-01", userId: "user-01" });

    vi.setSystemTime(new Date(2025, 1, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      gymId: "gym-01",
      userId: "user-01",
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });
});
