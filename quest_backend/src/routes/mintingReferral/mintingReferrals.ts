import { createReferral, deleteReferral, getAllReferrals, updateReferral } from "../../controllers/mintingReferral/mintingReferral";
import express from "express";

const referralRouter=express.Router();

referralRouter.post("/",createReferral);
referralRouter.get("/",getAllReferrals);
referralRouter.delete("/:id",deleteReferral);
referralRouter.put("/:id",updateReferral);

export default referralRouter;

