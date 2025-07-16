import { describe, it, expect, beforeEach } from "vitest";

import { FetchUserCheckInsHistory } from "./fetch-user-check-ins-history-use-case";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInsHistory;

describe("Fetch User Check-ins Use Case", () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInsHistory(inMemoryCheckInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await inMemoryCheckInsRepository.create({
      user_id: "user-01",
      gym_id: "gym-01",
    });

    await inMemoryCheckInsRepository.create({
      user_id: "user-01",
      gym_id: "gym-02",
    });

    const { checkIns } = await sut.execute({ userId: "user-01", page: 1 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check-ins history", async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryCheckInsRepository.create({
        user_id: "user-01",
        gym_id: i < 10 ? `gym-0${i}` : `gym-${i}`,
      });
    }

    const { checkIns } = await sut.execute({ userId: "user-01", page: 2 });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
