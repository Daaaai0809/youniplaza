import { Hono } from 'hono';
import * as schema from '@/schema';

type Bindings = {
  DB: D1Database,
};

const app = new Hono<{ Bindings: Bindings }>()

const usersGroup = new Hono<{ Bindings: Bindings }>()

usersGroup.get('/', async (c) => {
  return c.text('Hello, world!');
});

export default app
