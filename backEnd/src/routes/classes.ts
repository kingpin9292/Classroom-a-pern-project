import express from "express";
import { db } from "../db";
import { classes, departments, subjects, user } from "../db/schema/index";
import { error } from "node:console";
import { and, eq, getTableColumns, ilike, or, sql, desc } from "drizzle-orm";

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
// Get all classes with optional search, subject, teacher filters, and pagination
router.get("/", async (req, res) => {
  const { search, subject, teacher, page = 1, limit = 10 } = req.query;
  const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
  const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10)) || 10, 100);
  const offset = (currentPage - 1) * limitPerPage;

  const filterConditions = [];

  try {
    if (search) {
      filterConditions.push(or(ilike(classes.name, `%${search}%`), ilike(classes.inviteCode, `%${search}%`)));
    }

    if (subject) {
      filterConditions.push(ilike(subjects.name, `%${subject}%`));
    }

    if (teacher) {
      filterConditions.push(ilike(user.name, `%${teacher}%`));
    }

    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count ?? 0;

    const classesList = await db
      .select({
        ...getTableColumns(classes),
        subject: { ...getTableColumns(subjects) },
        teacher: { ...getTableColumns(user) },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(whereClause)
      .orderBy(desc(classes.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: classesList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        toalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (error) {
    console.log("GET /classes error:", error);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// Get class details with counts
router.get("/:id", async (req, res) => {
  try {
    const classId = Number(req.params.id);

    if (!Number.isFinite(classId)) {
      return res.status(400).json({ error: "Invalid class id" });
    }

    const [classDetails] = await db
      .select({
        ...getTableColumns(classes),
        subject: { ...getTableColumns(subjects) },
        department: { ...getTableColumns(departments) },
        teacher: { ...getTableColumns(user) },
      })
      .from(classes)
      .leftJoin(subjects, eq(classes.subjectId, subjects.id))
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .leftJoin(user, eq(classes.teacherId, user.id))
      .where(eq(classes.id, classId));

    if (!classDetails) return res.status(404).json({ error: "Class not found" });

    res.status(200).json({ data: classDetails });
  } catch (error) {
    console.error("GET /classes/:id error:", error);
    res.status(500).json({ error: "Failed to fetch class" });
  }
});

export default router;
