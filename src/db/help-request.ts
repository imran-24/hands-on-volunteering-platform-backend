import { HelpRequest, Comment } from "@prisma/client";
import { prisma } from "../libs/prisma";


const POST_BATCH = 5;

export const allHelpRequests = async (cursor: string) => {
  let posts: HelpRequest[] = [];
  if (cursor) {
    posts = await prisma.helpRequest.findMany({
      take: POST_BATCH,
      skip: 1,
      cursor: {
        id: cursor,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } else {
    posts = await prisma.helpRequest.findMany({
      take: POST_BATCH,
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  let nextCursor = null;
  if (posts.length === POST_BATCH) {
    nextCursor = posts[POST_BATCH - 1].id;
  }

  return { posts, nextCursor };
};

export const createHelprequest = (values: HelpRequest) =>
  prisma.helpRequest.create({
    data: {
      ...values,
    },
    include: {
      user: true,
    },
  });

export const addComments = (values: Comment) =>
  prisma.comment.create({
    data: {
      ...values,
    },
    include: {
      helpRequest: {
        include: {
          comments: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

export const onDelete = (id: string) =>
  prisma.helpRequest.delete({
    where: {
      id,
    },
  });

export const onUpdate = (value: HelpRequest, id: string) =>
  prisma.helpRequest.update({
    where: {
      id: id,
    },
    data: value,
    include: {
      user: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  });
