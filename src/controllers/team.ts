
import express from "express";
import { allTeams, createTeam, findTeam, findTeamById, joinTeam, leaveTeam, onDelete, onUpdate } from "../db/team";
import { prisma } from "../libs/prisma";

export const getAllTeamsController = async (
  req: express.Request,
  res: express.Response
) => {
  try {

    const cursor = req.query.cursor as string;
    const {teams, nextCursor} = await allTeams(cursor);

    return res.status(200).json({
      teams,
      nextCursor
    });
  } catch (error) {
    console.log("TEAM_GET_ALL", error);
    return res.status(500).json({ error: "Server error" });
  }
};


export const getTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.params;
    const { id } = data;

    if (!id) return res.status(401).json({ error: "Event ID is missing" });

    const team = await findTeamById(id);
    return res.status(200).json(team);
  } catch (error) {
    console.log("TEAM_GET_", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// Create a new event
export const createTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const teamData = req.body;
    const { name, organizerId } = teamData;

    if (!name || !organizerId)
      return res.status(401).json({ error: "Something is missing" });

    const newEvent = await createTeam(teamData);
    return res.status(201).json(newEvent).end();
  } catch (error) {
    console.log("TEAM_POST", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const requestData = req.body;
    const { id } = req.params;

    const { name, description, organizerId } = requestData;

    if (!name || !organizerId || !description || !id)
      return res.status(401).json({ error: "Something is missing" });

    const existingHelpRequest = prisma.team.findFirst({
      where: {
        id,
      },
    });

    if (!existingHelpRequest)
      return res.status(404).json({ error: "Post not found" });

    const updatedRequest = await onUpdate(requestData, id);
    return res.status(201).json(updatedRequest).end();
  } catch (error) {
    console.log("TEAM_UPDATE", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const JoinTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    const { teamId, userId } = data;
    // Check if the user is already registered for the event
    const existingEntry = await findTeam(userId, teamId);

    if (existingEntry) {
      return res
        .status(401)
        .json({ error: "User is already part of the team." });
    }

    // Insert a new record in the UserTeam table
    const userTeam = await joinTeam(userId, teamId);

    return res.status(201).json(userTeam).end();
  } catch (error) {
    console.log("JOIN_TEAM_POST", error);

    console.error("Error joining event:", error);
  }
};

export const leaveTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = req.body;
    const { teamId, userId } = data;
    // Check if the user is already registered for the event
    const existingEntry = await findTeam(userId, teamId);

    if (!existingEntry) {
      return res
        .status(401)
        .json({ error: "User is not part of the team." });
    }

    // Insert a new record in the UserEvent table
    const userTeam = await leaveTeam(existingEntry.id);

    return res.status(200).json(userTeam).end();
  } catch (error) {
    console.log("LEAVE_TEAM_POST", error);
    console.error("Error leaveing team:", error);
  }
};


export const deleteTeamController = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedTeam = await onDelete(id);
    if (!deletedTeam) {
      return res.sendStatus(404);
    }
    return res.status(200).json(deletedTeam).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};