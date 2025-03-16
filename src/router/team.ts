import { createTeamController, deleteTeamController, getAllTeamsController, getTeamController, JoinTeamController, leaveTeamController, updateTeamController,  } from "../controllers/team";
import express from "express";

export default (router: express.Router) => {

  router.get("/teams", getAllTeamsController);
  
  router.get("/teams/:id", getTeamController);

  router.patch("/teams/:id", updateTeamController);
 
  router.delete("/teams/:id", deleteTeamController);

  router.post("/teams", createTeamController);

  router.post("/teams/join", JoinTeamController);

  router.post("/teams/leave", leaveTeamController);

  // // Update user by ID
  // router.patch("/users/:id", updateUserController);


  // // Delete user by ID
  // router.delete("/users/:id", isAuthenticated, deleteUserController);
};
