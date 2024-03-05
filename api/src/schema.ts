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
    updated_at: text("updated_at"),
    deleted_at: text("deleted_at"),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    school: one(schools, {
        fields: [users.school_id],
        references: [schools.id],
    }),
    restaurants: many(restaurants),
    comments: many(comments),
    users_to_restaurants: many(users_to_restaurants),
}));

export const schools = sqliteTable('schools', {
    id: int("id").primaryKey(),
    name: text("name").unique().notNull(),
    prefecture_id: int("prefecture_id").notNull(),
    address: text("address").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"), 
    deleted_at: text("deleted_at"),
});

export const schoolsRelations = relations(schools, ({ many }) => ({
    users: many(users),
    restaurants: many(restaurants),
}));

export const restaurants = sqliteTable('restaurants', {
    id: int("id").primaryKey(),
    name: text("name").unique().notNull(),
    author_id: text("author_id").references(() => users.id),
    school_id: int("school_id").references(() => schools.id),
    prefecture_id: int("prefecture_id"),
    address: text("address"),
    rating: real("rating").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"),
    deleted_at: text("deleted_at"),
});

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
    user: one(users, {
        fields: [restaurants.author_id],
        references: [users.id],
    }),
    school: one(schools, {
        fields: [restaurants.school_id],
        references: [schools.id],
    }),
    comments: many(comments),
    photos: many(photos),
    tag_to_restaurants: many(tag_to_restaurants),
    users_to_restaurants: many(users_to_restaurants),
}));

export const users_to_restaurants = sqliteTable('users_to_restaurants', {
    user_id: text("user_id").references(() => users.id),
    restaurant_id: int("restaurant_id").references(() => restaurants.id),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.user_id, t.restaurant_id] }),
}));

export const comments = sqliteTable('comments', {
    id: int("id").primaryKey(),
    author_id: text("author_id").references(() => users.id),
    restaurant_id: int("restaurant_id").references(() => restaurants.id),
    content: text("content").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"), 
    deleted_at: text("deleted_at"),
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.author_id],
        references: [users.id],
    }),
    restaurant: one(restaurants, {
        fields: [comments.restaurant_id],
        references: [restaurants.id],
    }),
    photos: many(photos),
}));

export const tags = sqliteTable('tags', {
    id: int("id").primaryKey(),
    name: text("name").unique().notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"), 
    deleted_at: text("deleted_at"),
});

export const tagsRelations = relations(tags, ({ many }) => ({
    tag_to_restaurants: many(tag_to_restaurants),
}));

export const tag_to_restaurants = sqliteTable('tag_to_restaurants', {
    tag_id: int("tag_id").references(() => tags.id),
    restaurant_id: int("restaurant_id").references(() => restaurants.id),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"), 
    deleted_at: text("deleted_at"),
}, (t) => ({
    pk: primaryKey({ columns: [t.tag_id, t.restaurant_id] }),
}));

export const tag_to_restaurantsRelations = relations(tag_to_restaurants, ({ one }) => ({
    tag: one(tags, {
        fields: [tag_to_restaurants.tag_id],
        references: [tags.id],
    }),
    restaurant: one(restaurants, {
        fields: [tag_to_restaurants.restaurant_id],
        references: [restaurants.id],
    }),
}));

export const photos = sqliteTable('photos', {
    id: int("id").primaryKey(),
    comment_id: int("comment_id").references(() => comments.id),
    restaurant_id: int("restaurant_id").references(() => restaurants.id),
    url: text("url").notNull(),
    created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updated_at: text("updated_at"), 
    deleted_at: text("deleted_at"),
});
