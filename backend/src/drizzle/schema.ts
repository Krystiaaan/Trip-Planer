import { pgTable, serial, varchar, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const TripTable = pgTable("trip", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    image: text("images[]"),
    start_date: timestamp("start_date").notNull(),
    end_date: timestamp("end_date").notNull(),
    participants: integer("participants").notNull().default(0),
    //bonus ohne API
    finances: jsonb("finances")
});

export const DestinationTable = pgTable("destination", {
    id: serial("id").primaryKey(),
    trip_id: integer("trip_id").references(() => TripTable.id),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    date: timestamp("date").notNull(),
    activities: text("activities"),
    photos: text("photos[]"),
});