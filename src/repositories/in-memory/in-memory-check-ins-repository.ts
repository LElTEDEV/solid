import { randomUUID } from "node:crypto";

import { CheckIn, Prisma } from "@prisma/client";
import { CheckInsRespository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRespository {
  public checkIns: CheckIn[] = [];

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf("day");
    const endOfTheDay = dayjs(date).endOf("day");

    const checkInOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

      return checkIn.user_id === userId && isOnSameDate;
    });

    if (!checkInOnSameDate) return null;

    return checkInOnSameDate;
  }

  async findManyByUserId(userId: string, page: number) {
    return this.checkIns
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((item) => item.id === id);

    if (!checkIn) return null;

    return checkIn;
  }

  async countByUserId(userId: string) {
    return this.checkIns.filter((item) => item.user_id === userId).length;
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };

    this.checkIns.push(checkIn);

    return checkIn;
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id
    );

    if (checkInIndex >= 0) {
      this.checkIns[checkInIndex] = checkIn;
    }

    return checkIn;
  }
}
