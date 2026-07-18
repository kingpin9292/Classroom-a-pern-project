import express from "express";
import { db } from "../db";
import { classes } from "../db/schema/index";
import { error } from "node:console";

const router = express.Router();

router.post("/", async (require, res) => {
  try {
    const [createdClasses] = await db
      .insert(classes)
      .values({ ...require.body, inviteCode: Math.random().toString(36).substring(2, 9), schedules: [] })
      .returning({ id: classes.id });

    if (!createdClasses) throw Error;
    res.status(201).json({ data: createdClasses });
  } catch (error) {
    console.log(`POST /classes error ${error}`);
    res.status(500).json({ error: error });
  }
});
export default router;
