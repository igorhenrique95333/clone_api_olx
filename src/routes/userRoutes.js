import { Router } from "express";
import { getStates } from "../controllers/UserController.js";
import { authPrivate } from "../middlewares/Auth.js";
import { info } from "../controllers/AuthController.js";

const router = Router();

router.get("/states", getStates);

router.get("/user/me", authPrivate, info);
//router.get("/user/me", info);

//router.put("/user/me", update);

export default router;
