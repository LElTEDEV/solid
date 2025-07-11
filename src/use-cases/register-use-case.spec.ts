import { compare } from "bcryptjs";
import { expect, describe, it } from "vitest";

import { RegisterUseCase } from "./register-use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";

describe("Register Use Case", () => {
  it("should hash user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123123",
      user.password_hash
    );

    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
