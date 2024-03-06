import { relations, sql } from 'drizzle-orm';
import { int, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
    id: text("id").primaryKey(),
    username: text("username").unique().notNull(),
    name: text("name").notNull(),
    password: text("password").notNull(),
    email: text("email").unique().notNull(),
    // icon_url: text("icon_url"),
    school_id: int("school_id").references(() => schools.id),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    school: one(schools, {
        fields: [users.school_id],
        references: [schools.id],
    }),
    spots: many(spots),
    comments: many(comments),
    users_to_spots: many(users_to_spots),
}));

export const schools = sqliteTable('schools', {
    id: int("id").primaryKey(),
    name: text("name").unique().notNull(),
    prefecture_id: int("prefecture_id").notNull(),
    address: text("address").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const schoolsRelations = relations(schools, ({ many }) => ({
    users: many(users),
    spots: many(spots),
}));

export const spots = sqliteTable('spots', {
    id: int("id").primaryKey(),
    name: text("name").notNull(),
    author_id: text("author_id").references(() => users.id),
    school_id: int("school_id").references(() => schools.id),
    prefecture_id: int("prefecture_id").notNull(),
    address: text("address").notNull(),
    rating: real("rating").notNull().default(0),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const spotsRelations = relations(spots, ({ one, many }) => ({
    user: one(users, {
        fields: [spots.author_id],
        references: [users.id],
    }),
    school: one(schools, {
        fields: [spots.school_id],
        references: [schools.id],
    }),
    comments: many(comments),
    photos: many(photos),
    tag_to_spots: many(tag_to_spots),
    users_to_spots: many(users_to_spots),
}));

export const users_to_spots = sqliteTable('users_to_spots', {
    user_id: text("user_id").references(() => users.id, {onDelete: 'cascade'}),
    spot_id: int("spot_id").references(() => spots.id, {onDelete: 'cascade'}),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.user_id, t.spot_id] }),
}));

export const comments = sqliteTable('comments', {
    id: int("id").primaryKey(),
    author_id: text("author_id").references(() => users.id),
    spot_id: int("spot_id").references(() => spots.id),
    content: text("content").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.author_id],
        references: [users.id],
    }),
    spot: one(spots, {
        fields: [comments.spot_id],
        references: [spots.id],
    }),
    photos: many(photos),
}));

export const tags = sqliteTable('tags', {
    id: int("id").primaryKey(),
    name: text("name").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const tagsRelations = relations(tags, ({ many }) => ({
    tag_to_spots: many(tag_to_spots),
}));

export const tag_to_spots = sqliteTable('tag_to_spots', {
    tag_id: int("tag_id").references(() => tags.id, {onDelete: 'cascade'}).notNull(),
    spot_id: int("spot_id").references(() => spots.id, {onDelete: 'cascade'}).notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
}, (t) => ({
    pk: primaryKey({ columns: [t.tag_id, t.spot_id] }),
}));

export const tagToSpotsRelations = relations(tag_to_spots, ({ one }) => ({
    tag: one(tags, {
        fields: [tag_to_spots.tag_id],
        references: [tags.id],
    }),
    spot: one(spots, {
        fields: [tag_to_spots.spot_id],
        references: [spots.id],
    }),
}));

export const photos = sqliteTable('photos', {
    id: int("id").primaryKey(),
    spot_id: int("spot_id").references(() => spots.id),
    url: text("url").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    deleted_at: text("deleted_at"),
});

export const photosRelations = relations(photos, ({ one }) => ({
    comment: one(comments, {
        fields: [photos.spot_id],
        references: [comments.id],
    }),
    spot: one(spots, {
        fields: [photos.spot_id],
        references: [spots.id],
    }),
}));
