import { compare } from "bcryptjs";
import { expect, describe, it } from "vitest";

import { RegisterUseCase } from "./register-use-case";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await sut.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123123",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(inMemoryUsersRepository);

    const { user } = await sut.execute({
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

  it("should not be able to register with same email twice", async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository();
    const sut = new RegisterUseCase(inMemoryUsersRepository);

    const email = "jhondoe@email.com";

    await sut.execute({
      name: "John Doe",
      email,
      password: "123123",
    });

    expect(async () => {
      await sut.execute({
        name: "John Doe",
        email,
        password: "123123",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
