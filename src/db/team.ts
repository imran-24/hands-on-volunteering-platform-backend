import { Team } from "@prisma/client";
import { prisma } from "../libs/prisma";

const TEAM_BATCH = 2;

export const allTeams = async (cursor: string) => {
  let teams: Team[] = [];
  if (cursor) {
    teams = await prisma.team.findMany({
      take: TEAM_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organizer: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }else{
    teams = await prisma.team.findMany({
      take: TEAM_BATCH,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        organizer: true,
        members: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  
  let nextCursor = null;
  if (teams.length === TEAM_BATCH){
    nextCursor = teams[TEAM_BATCH - 1].id;
  }

  return {teams, nextCursor};
};

export const findTeam = (userId: string, teamId: string) =>
  prisma.userTeam.findFirst({
    where: { userId, teamId },
  });

export const findTeamById = (id: string) =>
  prisma.team.findFirst({
    where: { id },
  });

export const createTeam = (values: Team) =>
  prisma.team.create({
    data: {
      ...values,
      members: {
        create: {
          userId: values.organizerId,
        },
      },
    },
    include: {
      members: true,
    },
  });

export const joinTeam = (userId: string, teamId: string) =>
  prisma.userTeam.create({
    data: {
      userId,
      teamId,
    },
  });

export const leaveTeam = (id: string) =>
  prisma.userTeam.delete({
    where: {
      id,
    },
  });

export const onUpdate = (value: Team, id: string) =>
  prisma.team.update({
    where: {
      id: id,
    },
    data: value,
    include: {
      organizer: true,
      members: {
        include: {
          user: true,
        },
      },
    },
  });

export const onDelete = (id: string) => {
  return prisma.$transaction([
    prisma.userTeam.deleteMany({
      where: { teamId: id },
    }),
    prisma.team.delete({
      where: { id },
    }),
  ]);
};
