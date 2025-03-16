import { verifyJWT } from "../middlewares/index";
import { createEventController, getAllEventsController, getEventController, getMyEventsController, getTodaysEventsController, getTodaysLatestEventsController, JoinEventController, leaveEventController, updateEventController } from "../controllers/event";
import express from "express";

export default (router: express.Router) => {

  router.get("/events", getAllEventsController);
  
  router.get("/events/mine", verifyJWT, getMyEventsController);

  router.get("/events/today", verifyJWT,  getTodaysEventsController);

  router.get("/events/today/latest", verifyJWT, getTodaysLatestEventsController);

  router.get("/events/:id", getEventController);

  router.patch("/events/:id", updateEventController);

  router.post("/events", createEventController);

  router.post("/events/join", JoinEventController);

  router.post("/events/leave", leaveEventController);

  // // Update user by ID
  // router.patch("/users/:id", updateUserController);


  // // Delete user by ID
  // router.delete("/users/:id", isAuthenticated, deleteUserController);
};
