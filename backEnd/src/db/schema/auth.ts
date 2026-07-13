import { pgTable, text, boolean, timestamp, index, uniqueIndex, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// -----------------------------
// ENUMS
// -----------------------------
export const roleEnum = pgEnum("role", ["student", "teacher", "admin"]);

// -----------------------------
const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

// USER TABLE
// -----------------------------
export const user = pgTable("user", {
  id: text("id").primaryKey(), // Better Auth requires string PK

  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").notNull(),
  image: text("image"),
  role: roleEnum("role").default("student").notNull(),
  imageCldPubId: text("image_Cld_Pub_Id"),
  ...timestamp,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),

    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),

    ...timestamp,
  },
  (table) => ({
    userIdIdx: index("session_user_id_idx").on(table.userId),
    tokenUnique: uniqueIndex("session_token_unique").on(table.token),
  }),
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),

    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),

    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),

    scope: text("scope"),
    idToken: text("id_token"),
    password: text("password"),

    ...timestamp,
  },
  (table) => ({
    userIdIdx: index("account_user_id_idx").on(table.userId),
    accountUnique: uniqueIndex("account_provider_account_unique").on(table.providerId, table.accountId),
  }),
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),

    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expires_at: timestamp("expires_at").notNull(),
    ...timestamp,
  },
  (table) => ({
    identifierIdx: index("verification_identifier_idx").on(table.identifier),
  }),
);

// -----------------------------
// RELATIONS
// -----------------------------
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export type Account = typeof account.$inferSelect;
export type NewAccount = typeof account.$inferInsert;

export type Verification = typeof verification.$inferSelect;
export type NewVerification = typeof verification.$inferInsert;
