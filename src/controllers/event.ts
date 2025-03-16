import { prisma } from "../libs/prisma";
import {
  allEvents,
  createEvent,
  findEvent,
  findEventById,
  joinEvent,
  leaveEvent,
  myEvents,
  onUpdate,
  todayEvents,
  todayLatestEvents,
} from "../db/event";
import express from "express";
import { get } from "lodash";
import { User } from "@prisma/client";

export const getAllEventsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const cursor = req.query.cursor as string;
    const { events, nextCursor } = await allEvents(cursor);

    return res.status(200).json({
      events,
      nextCursor,
    });
  } catch (error) {
    console.log("EVENT_GET_ALL", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const getMyEventsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const identity = get(req, "identity.user") as User;

    const events = await myEvents(identity.id);

    return res.status(200).json({
      events,
    });
  } catch (error) {
    console.log("EVENT_GET_MINE", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTodaysEventsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const identity = get(req, "identity.user") as User;

    const events = await todayEvents(identity.id);

    return res.status(200).json({
      events
    });
  } catch (error) {
    console.log("EVENT_GET_TODAYS", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTodaysLatestEventsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const identity = get(req, "identity.user") as User;

    const event = await todayLatestEvents(identity.id);

    return res.status(200).json({
      event,
    });
  } catch (error) {
    console.log("EVENT_GET_TODAYS", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getEventController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.params;
    const { id } = data;

    if (!id) return res.status(401).json({ error: "Event ID is missing" });

    const event = await findEventById(id);
    return res.status(200).json(event);
  } catch (error) {
    console.log("EVENT_GET_TODAYS_LATEST", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new event
export const createEventController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const eventData = req.body;
    const { title, organizerId } = eventData;

    if (!title || !organizerId)
      return res.status(401).json({ error: "Something is missing" });

    const newEvent = await createEvent(eventData);
    return res.status(201).json(newEvent).end();
  } catch (error) {
    console.log("EVENT_POST", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateEventController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const requestData = req.body;
    const { id } = req.params;


    if ( !id)
      return res.status(401).json({ error: "EventId is missing" });

    const existingHelpRequest = prisma.team.findFirst({
      where: {
        id,
      },
    });

    if (!existingHelpRequest)
      return res.status(404).json({ error: "Event not found" });

    const updatedRequest = await onUpdate(requestData, id);
    return res.status(201).json(updatedRequest).end();
  } catch (error) {
    console.log("EVENT_UPDATE", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const JoinEventController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    const { eventId, userId } = data;
    // Check if the user is already registered for the event
    const existingEntry = await findEvent(userId, eventId);

    if (existingEntry) {
      return res
        .status(401)
        .json({ error: "User is already attending this event." });
    }

    // Insert a new record in the UserEvent table
    const userEvent = await joinEvent(userId, eventId);

    return res.status(201).json(userEvent).end();
  } catch (error) {
    console.log("JOIN_EVENT_POST", error);

    console.error("Error joining event:", error);
  }
};

export const leaveEventController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    const { eventId, userId } = data;
    // Check if the user is already registered for the event
    const existingEntry = await findEvent(userId, eventId);

    if (!existingEntry) {
      return res
        .status(401)
        .json({ error: "User is not attending this event." });
    }

    // Insert a new record in the UserEvent table
    const userEvent = await leaveEvent(existingEntry.id);

    return res.status(200).json(userEvent).end();
  } catch (error) {
    console.log("LEAVE_EVENT_POST", error);
    console.error("Error leaveing event:", error);
  }
};
