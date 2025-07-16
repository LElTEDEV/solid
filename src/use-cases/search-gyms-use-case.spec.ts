import { describe, it, expect, beforeEach } from "vitest";

import { SearchGymsUseCase } from "./search-gyms-use-case";
import { GymsRepository } from "@/repositories/gyms-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: GymsRepository;
let sut: SearchGymsUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymsUseCase(gymsRepository);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Academia Corpo & Movimento - ${i < 10 ? `0${i}` : `${i}`}`,
        latitude: -22.588436651306868,
        longitude: -46.52727780203995,
      });
    }

    const { gyms } = await sut.execute({ query: "movimento", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({
        title: "Academia Corpo & Movimento - 21",
      }),
      expect.objectContaining({
        title: "Academia Corpo & Movimento - 22",
      }),
    ]);
  });
});
