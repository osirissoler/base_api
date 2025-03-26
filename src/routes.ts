import { Router, Request, Response } from "express";
import rolRouter from "./routes/rol.routes";
import userRouter from "./routes/user.routes";
import authRouter from "./routes/auth.routes";

const router: Router = Router();

router.use("/rol", rolRouter);
router.use("/user", userRouter);
router.use("/login", authRouter);


export default router;
