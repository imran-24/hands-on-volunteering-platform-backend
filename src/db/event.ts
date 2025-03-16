import { Event } from "@prisma/client";
import { prisma } from "../libs/prisma";

const EVENT_BATCH = 6;

export const allEvents = async (cursor: string) => {
  let events: Event[] = [];
  if (cursor) {
    events = await prisma.event.findMany({
      take: EVENT_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      where: {
        date: {
          gte: new Date(),
        },
      },
      include: {
        organizer: true,
        attendees: {
          include:{
            user: true
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    events = await prisma.event.findMany({
      take: EVENT_BATCH,
      include: {
        organizer: true,
        attendees: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  let nextCursor = null;
  if (events.length === EVENT_BATCH) {
    nextCursor = events[EVENT_BATCH - 1].id;
  }

  return { events, nextCursor };
};

export const myEvents = (userId: string) => {
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  return prisma.event.findMany({
    where: {
      organizerId: userId,
      date: {
        gte: today,
        lte: sevenDaysFromNow,
      },
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const todayEvents = (userId: string) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  return prisma.event.findMany({
    where: {
      attendees: {
        some: {
          userId: userId,
        },
      },
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
  });
};

export const todayLatestEvents = (userId: string) => {
  const currentDateTime = new Date();

  return prisma.event.findFirst({
    where: {
      organizerId: userId,
      date: {
        gte: currentDateTime,
      },
    },
    include: {
      attendees: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const findEvent = (userId: string, eventId: string) =>
  prisma.userEvent.findFirst({
    where: { userId, eventId },
  });

export const findEventById = (id: string) =>
  prisma.event.findFirst({
    where: { id },
    include: {
      organizer: true,
      attendees: true,
    },
  });

export const createEvent = (values: any) =>
  prisma.event.create({
    data: {
      ...values,
    },
  });

export const onUpdate = (value: Event, id: string) =>
  prisma.event.update({
    where: {
      id: id,
    },
    data: value,
    include: {
      organizer: true,
      attendees: true,
    },
  });

export const joinEvent = (userId: string, eventId: string) =>
  prisma.userEvent.create({
    data: {
      userId,
      eventId,
    },
  });

export const leaveEvent = (id: string) =>
  prisma.userEvent.delete({
    where: {
      id,
    },
  });
