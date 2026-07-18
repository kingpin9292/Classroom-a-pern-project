import { desc, ilike, sql } from "drizzle-orm";
import express from "express";
import { db } from "../db/index.js";
import { departments } from "../db/schema/index.js";
const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const currentPage = Math.max(1, parseInt(String(page), 10) || 1);
        const limitPerPage = Math.min(Math.max(1, parseInt(String(limit), 10) || 10), 100);
        const offset = (currentPage - 1) * limitPerPage;
        const whereClause = search ? ilike(departments.name, `%${search}%`) : undefined;
        const [countResult, departmentList] = await Promise.all([
            db.select({ count: sql `count(*)` }).from(departments).where(whereClause),
            db.select().from(departments).where(whereClause).orderBy(desc(departments.createdAt)).limit(limitPerPage).offset(offset),
        ]);
        const total = countResult[0]?.count ?? 0;
        res.status(200).json({
            data: departmentList,
            pagination: {
                page: currentPage,
                limit: limitPerPage,
                total,
                totalPages: Math.ceil(total / limitPerPage),
            },
        });
    }
    catch (error) {
        console.error("Get /departments:", error);
        res.status(500).json({ error: "Failed to fetch departments" });
    }
});
export default router;
//# sourceMappingURL=departments.js.map