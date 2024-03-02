import { Hono } from 'hono';
import * as userService from '@/service/user_service';
import * as schema from '@/schema';
import { drizzle } from 'drizzle-orm/d1';
import { CreateUserRequest, UpdateUserRequest } from './request/user_request';

type Bindings = {
  DB: D1Database,
};

const app = new Hono<{ Bindings: Bindings }>();

const usersGroup = new Hono<{ Bindings: Bindings }>()

usersGroup.get('/', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });

  const res = await userService.getUsers({ db: db })

  return c.json(res, 200);
});
usersGroup.get('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const id = await c.req.param('id');

  const res = await userService.getUserByID({ db: db, id: id});

  return c.json(res, 200);
});
usersGroup.get('/search/:keyword', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const keyword = await c.req.param('keyword');

  const res = await userService.getUserByKeyword({ db: db, keyword: keyword });

  return c.json(res, 200);
});
usersGroup.put('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const id = await c.req.param('id');
  const req = await c.req.json<UpdateUserRequest>();

  const res = await userService.updateUser({ db: db, req: { ...req, id } });

  return c.json(res, 200);
});
usersGroup.delete('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const id = await c.req.param('id');

  const res = await userService.deleteUser({ db: db, id: id });

  return c.json(res, 200);
});

app.route('/users', usersGroup);

export default app
