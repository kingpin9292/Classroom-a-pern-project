import { and, ilike, or, sql, eq, getTableColumns, desc } from "drizzle-orm";
import express from "express";
import { departments, subjects } from "../db/schema/app.js";
import { db } from "../db";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { departmentId, name, code, description } = req.body;

    const [createdSubject] = await db
      .insert(subjects)
      .values({ departmentId, name, code, description })
      .returning({ id: subjects.id });

    if (!createdSubject) throw Error;

    res.status(201).json({ data: createdSubject });
  } catch (error) {
    console.error("POST /subjects error:", error);
    res.status(500).json({ error: "Failed to create subject" });
  }
});

// get all subjects with optional search, filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { search, department, page = 1, limit = 10 } = req.query;

    const currentPage = Math.max(1, parseInt(String(page), 10) || 1);

    const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100); //Max 100 records per page

    const offset = (currentPage - 1) * limitPerPage;

    const filterConditions = [];
    //if search query exists, filter by name or subject code
    if (search) {
      filterConditions.push(or(ilike(subjects.name, `%${search}%`), ilike(subjects.code, `%${search}%`)));
    }
    //if department filter exists, match department name
    if (department) {
      const deptPattern = `%${String(department).replace(/[%_]/g, "\\$&")}%`;
      filterConditions.push(ilike(departments.name, deptPattern));
    }
    //combine all filters using AND if any exists
    const whereClause = filterConditions.length > 0 ? and(...filterConditions) : undefined;

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause);

    const totalCount = countResult[0]?.count || 0;

    const subjectList = await db
      .select({
        ...getTableColumns(subjects),
        department: { ...getTableColumns(departments) },
      })
      .from(subjects)
      .leftJoin(departments, eq(subjects.departmentId, departments.id))
      .where(whereClause)
      .orderBy(desc(subjects.createdAt))
      .limit(limitPerPage)
      .offset(offset);

    res.status(200).json({
      data: subjectList,
      pagination: {
        page: currentPage,
        limit: limitPerPage,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limitPerPage),
      },
    });
  } catch (err) {
    console.error(`Get /subjects error: ${err}`);
    res.status(500).json({
      error: "failed to get subjects",
    });
  }
});

export default router;
