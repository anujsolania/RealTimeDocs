import express from "express";
import userRouter from "./user.router";
import docRouter from "./document.router";
const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/user", userRouter);
router.use("/document", docRouter);

export default router;
