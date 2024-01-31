import prisma from "../prisma";

export type RoomDB = {
  uuid: string;
  userId: number;
  apiUrl: string;
  masterKey: string;
  userKey: string;

  movieUrl: string;
  avatarUrl: string;
  motionUUID: string;
  stageUUID: string;
};

export class roomDB {
  async Get({ uuid }: { uuid: string }) {
    return prisma.room.findUnique({
      where: {
        uuid: uuid,
      },
    });
  }

  async Create(data: RoomDB) {
    return prisma.room.create({
      data: {
        uuid: data.uuid,
        userId: data.userId,
        apiUrl: data.apiUrl,
        masterKey: data.masterKey,
        userKey: data.userKey,

        movieUrl: data.movieUrl,
        avatarUrl: data.avatarUrl,
        motionUUID: data.motionUUID,
        stageUUID: data.stageUUID,
      },
    });
  }
}
