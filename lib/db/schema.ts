import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  // Siempre normalizado en minúsculas (lo hace lib/newsletter.ts).
  email: text("email").notNull().unique(),
  // 'es' | 'en'
  lang: text("lang").notNull(),
  // 'contacto' | 'contacto-form' | 'home' | 'release:<slug>'
  source: text("source").notNull(),
  // 'pending' | 'subscribed' | 'unsubscribed' (doble opt-in llega en K2)
  status: text("status").notNull().default("subscribed"),
  consentText: text("consent_text").notNull(),
  consentAt: timestamp("consent_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  unsubscribedAt: timestamp("unsubscribed_at", { withTimezone: true }),
  // sha256(IP + sal diaria). Nunca la IP.
  ipHash: text("ip_hash"),
});

export type Subscriber = typeof subscribers.$inferSelect;
