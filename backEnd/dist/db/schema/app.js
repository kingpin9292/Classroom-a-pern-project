import { relations } from "drizzle-orm";
import { index, integer, jsonb, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./auth.js";
const timeStamps = {
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
};
export const classStatusEnum = pgEnum("class_status", ["active", "inactive", "archived"]);
export const departments = pgTable("departments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    name: varchar("name", {
        length: 255,
    }).notNull(),
    description: text("description"),
    ...timeStamps,
});
export const subjects = pgTable("subjects", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    departmentId: integer("department_id")
        .notNull()
        .references(() => departments.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 255 }).notNull(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    description: text("description"),
    ...timeStamps,
});
export const classes = pgTable("classes", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    subjectId: integer("subject_id")
        .notNull()
        .references(() => subjects.id, { onDelete: "cascade" }),
    teacherId: text("teacher_id")
        .notNull()
        .references(() => user.id, { onDelete: "restrict" }),
    inviteCode: varchar("invite_code", { length: 50 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    bannerCldPubId: text("banner_cld_pub_id"),
    bannerUrl: text("banner_url"),
    capacity: integer("capacity").notNull().default(50),
    description: text("description"),
    status: classStatusEnum("status").notNull().default("active"),
    schedules: jsonb("schedules").$type().notNull(),
    ...timeStamps,
}, (table) => ({
    subjectIdIdx: index("classes_subject_id_idx").on(table.subjectId),
    teacherIdIdx: index("classes_teacher_id_idx").on(table.teacherId),
}));
export const enrollments = pgTable("enrollments", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    studentId: text("student_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    classId: integer("class_id")
        .notNull()
        .references(() => classes.id, { onDelete: "cascade" }),
    ...timeStamps,
}, (table) => ({
    studentIdIdx: index("enrollments_student_id_idx").on(table.studentId),
    classIdIdx: index("enrollments_class_id_idx").on(table.classId),
    studentClassUnique: index("enrollments_student_class_unique").on(table.studentId, table.classId),
}));
const departmentRelations = relations(departments, ({ many }) => ({ subjects: many(subjects) }));
const subjectRelations = relations(subjects, ({ one, many }) => ({
    department: one(departments, {
        fields: [subjects.departmentId],
        references: [departments.id],
    }),
}));
//# sourceMappingURL=app.js.map