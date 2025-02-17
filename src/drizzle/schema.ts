import { pgTable, serial, varchar, boolean, timestamp, integer, text, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm"


export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    authId: integer("auth_Id").notNull(),
    name: text("name").notNull(),
    emailId: text("email").notNull().unique(),

})

