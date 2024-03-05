import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import * as authService from '@/service/auth_service';
import * as userService from '@/service/user_service';
import * as schema from '@/schema';
import { drizzle } from 'drizzle-orm/d1';
import { UpdateUserRequest } from './request/user_request';
import { errorMessages } from './const/error_messages';
import { LoginResponse } from './response/auth_response';
import { LoginRequest, SignUpRequest } from './request/auth_request';
import { DAY } from './const/time';
import { GetUserByIDResponse } from './response/user_response';

type Bindings = {
  DB: D1Database,
  TOKEN_BLACK_LIST: KVNamespace,
  JWT_SECRET: string,
  ENV: string
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', async (c, next) => {
  const token = getCookie(c, 'access_token');
  if (!token) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const isBlackList = await c.env.TOKEN_BLACK_LIST.get(token);
  if (isBlackList) {
    return c.json({ message: 'Unauthorized' }, 401);
  }

  const db = drizzle(c.env.DB, { schema: schema });

  await authService.checkToken({ token: token, db: db, blackList: c.env.TOKEN_BLACK_LIST }).catch((err) => {
    if (err === errorMessages.auth.invalidToken) {
      return c.json({ message: errorMessages.auth.unauthorized }, 401);
    } else if (err === errorMessages.auth.tokenExpired) {
      return c.json({ message: errorMessages.auth.unauthorized }, 401);
    } else if (err === errorMessages.auth.notFound) {
      return c.json({ message: errorMessages.auth.unauthorized }, 403);
    }
  });

  await next();
});

const authGroup = new Hono<{ Bindings: Bindings }>();

authGroup.post('/signup', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const req = await c.req.json<SignUpRequest>();

  const res = await authService.signUp({ db: db, req: req, secret: c.env.JWT_SECRET }).catch((err) => {
    return c.json({ message: err.message }, 500);
  }) as LoginResponse;

  const sameSite = c.env.ENV === 'production' ? 'None' : 'Lax';

  setCookie(c, 'access_token', res.access_token, { maxAge: DAY, httpOnly: true, sameSite: sameSite });
  setCookie(c, 'refresh_token', res.refresh_token, { maxAge: 30 * DAY, httpOnly: true, sameSite: sameSite });

  return c.text('OK', 200);
});
authGroup.post('/login', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const req = await c.req.json<LoginRequest>();

  const res = await authService.login({ username: req.username, password: req.password, db: db, secret: c.env.JWT_SECRET }).catch((err) => {
    return c.json({ message: err.message }, 401);
  }) as LoginResponse;

  const sameSite = c.env.ENV === 'production' ? 'None' : 'Lax';

  setCookie(c, 'access_token', res.access_token, { maxAge: DAY, httpOnly: true, sameSite: sameSite });
  setCookie(c, 'refresh_token', res.refresh_token, { maxAge: 30 * DAY, httpOnly: true, sameSite: sameSite });

  return c.text('OK', 200);
});
authGroup.get('/logout', async (c) => {
  const token = getCookie(c, 'access_token');
  if (!token) {
    deleteCookie(c, 'access_token');
    deleteCookie(c, 'refresh_token');
    return c.json({ message: errorMessages.auth.unauthorized }, 401);
  }
  await authService.logout({ token: token, blackList: c.env.TOKEN_BLACK_LIST });

  deleteCookie(c, 'access_token');
  deleteCookie(c, 'refresh_token');

  return c.json({ message: 'Logged out' }, 200);
});
authGroup.get('/refresh', async (c) => {
  const token = getCookie(c, 'refresh_token');
  if (!token) {
    deleteCookie(c, 'access_token');
    deleteCookie(c, 'refresh_token');
    return c.json({ message: errorMessages.auth.unauthorized }, 401);
  }

  const db = drizzle(c.env.DB, { schema: schema });

  const res = await authService.refresh({ token: token, db: db, blackList: c.env.TOKEN_BLACK_LIST, secret: c.env.JWT_SECRET }).catch((err) => {
    deleteCookie(c, 'access_token');
    deleteCookie(c, 'refresh_token');
    return c.json({ message: err.message }, 401);
  }) as LoginResponse;

  const sameSite = c.env.ENV === 'production' ? 'None' : 'Lax';

  setCookie(c, 'access_token', res.access_token, { maxAge: DAY, httpOnly: true, sameSite: sameSite });
  setCookie(c, 'refresh_token', res.refresh_token, { maxAge: 30 * DAY, httpOnly: true, sameSite: sameSite });

  return c.text('OK', 200);
});

const usersGroup = new Hono<{ Bindings: Bindings }>()

usersGroup.get('/', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });

  const res = await userService.getUsers({ db: db })

  return c.json(res, 200);
});
usersGroup.get('/search', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const keyword = await c.req.query('keyword') || '';
  
  const res = await userService.getUserByKeyword({ db: db, keyword: keyword });

  return c.json(res, 200);
});
usersGroup.get('/:id', async (c) => {
  const db = drizzle(c.env.DB, { schema: schema });
  const id = await c.req.param('id');

  const res = await userService.getUserByID({ db: db, id: id});

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

  deleteCookie(c, 'access_token');
  deleteCookie(c, 'refresh_token');

  return c.json(res, 200);
});

const schoolsGroup = new Hono<{ Bindings: Bindings }>();

const api = new Hono<{ Bindings: Bindings }>();

app.route('/users', usersGroup);
app.route('/schools', schoolsGroup);
api.route('/auth', authGroup);
api.route('/app', app);

export default api;
