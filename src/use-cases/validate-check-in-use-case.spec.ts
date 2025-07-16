import { describe, it, expect, beforeEach } from "vitest";

import { ValidadeCheckInUseCase } from "./validate-check-in-use-case";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let checkInRepository: InMemoryCheckInsRepository;
let sut: ValidadeCheckInUseCase;

describe("Validate Check In Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new ValidadeCheckInUseCase(checkInRepository);
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
});
