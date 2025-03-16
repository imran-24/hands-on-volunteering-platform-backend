import { prisma } from "../libs/prisma";
import {
  addComments,
  allHelpRequests,
  createHelprequest,
  onDelete,
  onUpdate,
} from "../db/help-request";
import express from "express";

export const getAllHelpRequestsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const cursor = req.query.cursor as string;
    const { posts, nextCursor } = await allHelpRequests(cursor);

    return res.status(200).json({
      posts,
      nextCursor,
    });
  } catch (error) {
    console.log("HELP_REQUEST_GET_ALL", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new event
export const createHelpRequestController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const requestData = req.body;
    const { title, description, userId } = requestData;

    if (!title || !userId || !description)
      return res.status(401).json({ error: "Something is missing" });

    const newEvent = await createHelprequest(requestData);
    return res.status(201).json(newEvent).end();
  } catch (error) {
    console.log("HELP_REQUEST_POST", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new event
export const addCommentsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const commentData = req.body;
    const { content, userId, helpRequestId } = commentData;

    if (!content || !userId || !helpRequestId)
      return res.status(401).json({ error: "Something is missing" });

    const existingHelpRequest = prisma.helpRequest.findFirst({
      where: {
        id: helpRequestId,
      },
    });

    if (!existingHelpRequest)
      return res.status(404).json({ error: "Post not found" });

    const updatedData = await addComments(commentData);
    return res.status(201).json(updatedData.helpRequest.comments).end();
  } catch (error) {
    console.log("COMMENT_POST", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateHelpRequestController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const requestData = req.body;
    const { id } = req.params;

    const { title, description, userId } = requestData;

    if (!title || !userId || !description || !id)
      return res.status(401).json({ error: "Something is missing" });

    const existingHelpRequest = prisma.helpRequest.findFirst({
      where: {
        id,
      },
    });

    if (!existingHelpRequest)
      return res.status(404).json({ error: "Post not found" });

    const updatedRequest = await onUpdate(requestData, id);
    return res.status(201).json(updatedRequest).end();
  } catch (error) {
    console.log("HELP_REQUEST_UPDATE", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete Product by ID
export const deleteHelpRequestController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(401).json({ error: "Something is missing" });

    const deletedPost = await onDelete(id);

    if (!deletedPost) {
      return res.sendStatus(404);
    }

    return res.status(200).json(deletedPost).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
