import { addCommentsController, createHelpRequestController, deleteHelpRequestController, getAllHelpRequestsController, updateHelpRequestController } from "../controllers/help-request";
import express from "express";

export default (router: express.Router) => {
  router.get("/help-requests", getAllHelpRequestsController);

  // router.get("/events/:id", getEventController);

  router.post("/help-requests", createHelpRequestController);
  router.post("/help-requests/comments", addCommentsController);

  // // Update help-requests by ID
  router.patch("/help-requests/:id", updateHelpRequestController);

  // // Delete help-requests by ID
  router.delete("/help-requests/:id", deleteHelpRequestController);
};
