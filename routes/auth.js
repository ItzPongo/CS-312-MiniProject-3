import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;

const router = express.Router();

const pool = new Pool({
  connectionString: 'postgres://postgres:KingPig2003@localhost:5432/BlogDB',
});

router.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

router.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;

  const checkUser = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
  if (checkUser.rows.length > 0) {
    return res.render('signup', { error: 'User ID already taken' });
  }

  await pool.query('INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)', [user_id, password, name]);
  res.redirect('/signin');
});

router.get('/signin', (req, res) => {
  res.render('signin', { error: null });
});

router.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;

  const user = await pool.query('SELECT * FROM users WHERE user_id = $1 AND password = $2', [user_id, password]);

  if (user.rows.length === 0) {
    return res.render('signin', { error: 'Invalid user ID or password' });
  }

  req.session.user = user.rows[0];
  res.redirect('/blogs');
});

export default router;