import { Router } from "express";
import authUser from "../middleware/auth.js";
import { changeRoleToOwner } from "../controller/Owner.js";


const ownerRouter = Router()

ownerRouter.post("/change-role", authUser,changeRoleToOwner)

export default ownerRouter