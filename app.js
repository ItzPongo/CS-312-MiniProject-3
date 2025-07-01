import express from 'express';
import session from 'express-session';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: false
}));

let posts = [];
let postId = 1;

// Auth routes (signup & signin)
app.use(authRoutes);

// Blog Routes
app.get('/blogs', async (req, res) => {
  if (!req.session?.user) {
    return res.redirect('/signin');
  }

  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY date_created DESC');
    res.render('blog', { posts: result.rows, user: req.session.user });
  } catch (err) {
    console.error('DB query error:', err);
    res.status(500).send('Error fetching posts');
  }
});

// Home page - show all posts
app.get('/', (req, res) => {
  res.render('blog', { posts, user: req.session.user || null });
});

// Form to create a new post
app.get('/new', (req, res) => {
  if (!req.session.user) return res.redirect('/signin');
  res.render('new');
});

// Create a new post
app.post('/create', (req, res) => {
  const { title, content } = req.body;
  const author = req.session.user?.name || 'Anonymous';

  if (!title || !content || !author) {
    return res.status(400).send('All fields are required.');
  }

  posts.push({
    id: postId++,
    title,
    content,
    author,
    timestamp: new Date().toLocaleString()
  });

  res.redirect('/');
});

// View a single post
app.get('/post/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  res.render('post', { post });
});

// Edit post form
app.get('/edit/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  if (!req.session.user || req.session.user.name !== post.author) {
    return res.status(403).send('Unauthorized to edit this post');
  }
  res.render('edit', { post });
});

// Update a post
app.post('/update/:id', (req, res) => {
  const { title, content } = req.body;
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  if (!req.session.user || req.session.user.name !== post.author) {
    return res.status(403).send('Unauthorized to update this post');
  }
  post.title = title || post.title;
  post.content = content || post.content;
  post.timestamp = new Date().toLocaleString();
  res.redirect('/');
});

// Delete a post
app.post('/delete/:id', (req, res) => {
  const post = posts.find(p => p.id === Number(req.params.id));
  if (!post) return res.status(404).send('Post not found');
  if (!req.session.user || req.session.user.name !== post.author) {
    return res.status(403).send('Unauthorized to delete this post');
  }
  posts = posts.filter(p => p.id !== post.id);
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  const interfaces = os.networkInterfaces();
  Object.entries(interfaces).forEach(([name, iface]) => {
    iface.forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        console.log(`Accessible at http://${details.address}:${PORT}`);
      }
    });
  });
  console.log(`Server running at http://localhost:${PORT}`);
});
