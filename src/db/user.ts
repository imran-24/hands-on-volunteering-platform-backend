import { User } from "@prisma/client";
import { prisma } from "../libs/prisma";

export const getUsers = () => prisma.user.findMany();

export const getUserByEmail = (email: string) =>
  prisma.user.findUnique({
    where: { email },
  });



export const getUserByUserId = (id: string) =>
  prisma.user.findUnique({
    where: { id },
  });

export const createUser = (values: any) =>
  prisma.user.create({
    data: {
      ...values,
    },
  });

export const deleteUserById = (id: string) =>
  prisma.user.delete({
    where: { id },
  });

export const updateUserByUserId = (id: string, values: User) =>
  prisma.user.update({
    where: { id },
    data: values,
  });
