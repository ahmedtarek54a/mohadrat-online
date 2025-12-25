const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const port = 3001; // Changed to avoid conflicts

// Middleware to parse JSON bodies
// Middleware to parse JSON bodies
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for data files
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const VIDEOS_FILE = path.join(DATA_DIR, 'videos.json');
const ASSIGNMENTS_FILE = path.join(DATA_DIR, 'assignments.json');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Unique filename: timestamp-originalName
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({ storage: storage });

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}
// Ensure files exist
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '{}');

if (!fs.existsSync(COURSES_FILE)) fs.writeFileSync(COURSES_FILE, '[]');
if (!fs.existsSync(VIDEOS_FILE)) fs.writeFileSync(VIDEOS_FILE, '[]');
if (!fs.existsSync(ASSIGNMENTS_FILE)) fs.writeFileSync(ASSIGNMENTS_FILE, '[]');

function readJSON(file, defaultData = {}) {
    try {
        const data = fs.readFileSync(file, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return defaultData;
    }
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// --- APIs ---

// 1. Auth APIs
app.post('/api/signup', (req, res) => {
    const { fullName, email, password, role } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const users = readJSON(USERS_FILE, {});
    if (users[email]) {
        return res.status(409).json({ error: 'User already exists' });
    }

    users[email] = {
        name: fullName,
        password: password, // In a real app, hash this!
        role: role || 'student',
        joinedAt: new Date().toISOString()
    };

    writeJSON(USERS_FILE, users);
    res.json({ success: true, message: 'User created' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readJSON(USERS_FILE, {});
    const user = users[email];

    if (user && user.password === password) {
        res.json({
            success: true,
            user: {
                name: user.name,
                email: email,
                role: user.role
            }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.get('/api/users', (req, res) => {
    // For admin to list users
    // In real app, check admin token here
    const users = readJSON(USERS_FILE, {});
    // Return list without passwords
    const userList = Object.keys(users).map(email => ({
        email,
        name: users[email].name,
        role: users[email].role,
        joinedAt: users[email].joinedAt
    }));
    res.json(userList);
});

app.delete('/api/users/:email', (req, res) => {
    const email = req.params.email;
    const users = readJSON(USERS_FILE, {});

    if (users[email]) {
        delete users[email];
        writeJSON(USERS_FILE, users);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});


// 2. Course APIs
app.get('/api/courses', (req, res) => {
    const courses = readJSON(COURSES_FILE, []);
    res.json(courses);
});

app.post('/api/courses', (req, res) => {
    const newCourse = req.body;
    // Basic validation
    if (!newCourse.title || !newCourse.description) {
        return res.status(400).json({ error: 'Invalid course data' });
    }

    const courses = readJSON(COURSES_FILE, []);
    // Generate ID if missing
    if (!newCourse.id) {
        newCourse.id = 'course-' + Date.now();
    }

    courses.push(newCourse);
    writeJSON(COURSES_FILE, courses);
    res.json({ success: true, course: newCourse });
});

app.delete('/api/courses/:id', (req, res) => {
    const { id } = req.params;
    let courses = readJSON(COURSES_FILE, []);
    const initialLength = courses.length;
    courses = courses.filter(c => c.id !== id);

    if (courses.length !== initialLength) {
        writeJSON(COURSES_FILE, courses);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Basic API route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Server is running', timestamp: new Date() });
});

// --- NEW APIs for Content Management ---

// 3. File Upload API
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    // Return the relative path for frontend use
    res.json({
        success: true,
        filePath: `uploads/${req.file.filename}`,
        originalName: req.file.originalname
    });
});

// 4. Video APIs
app.get('/api/videos', (req, res) => {
    const videos = readJSON(VIDEOS_FILE, []);
    res.json(videos);
});

app.post('/api/videos', (req, res) => {
    const newVideo = req.body;
    // content: { title, type: 'youtube'|'local', url, courseId(optional) }
    if (!newVideo.title || !newVideo.url) {
        return res.status(400).json({ error: 'Missing video details' });
    }

    const videos = readJSON(VIDEOS_FILE, []);
    newVideo.id = 'vid-' + Date.now();
    videos.push(newVideo);
    writeJSON(VIDEOS_FILE, videos);

    res.json({ success: true, video: newVideo });
});

// 5. Assignment APIs
app.get('/api/assignments', (req, res) => {
    const assignments = readJSON(ASSIGNMENTS_FILE, []);
    res.json(assignments);
});

app.post('/api/assignments', (req, res) => {
    const newAssign = req.body;
    // content: { title, description, fileUrl, courseId(optional) }
    if (!newAssign.title || !newAssign.fileUrl) {
        return res.status(400).json({ error: 'Missing assignment details' });
    }

    const assignments = readJSON(ASSIGNMENTS_FILE, []);
    newAssign.id = 'assign-' + Date.now();
    assignments.push(newAssign);
    writeJSON(ASSIGNMENTS_FILE, assignments);

    res.json({ success: true, assignment: newAssign });
});



// --- Forum APIs ---
const FORUM_FILE = path.join(DATA_DIR, 'forum.json');
if (!fs.existsSync(FORUM_FILE)) fs.writeFileSync(FORUM_FILE, '[]');

// Get all posts
app.get('/api/forum', (req, res) => {
    const posts = readJSON(FORUM_FILE, []);
    res.json(posts);
});

// Create a post
app.post('/api/forum', (req, res) => {
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const posts = readJSON(FORUM_FILE, []);
    const newPost = {
        id: 'post-' + Date.now(),
        author,
        content,
        timestamp: new Date().toISOString(),
        replies: []
    };
    posts.unshift(newPost); // Newest first
    writeJSON(FORUM_FILE, posts);
    res.json({ success: true, post: newPost });
});

// Reply to a post
app.post('/api/forum/:id/replies', (req, res) => {
    const { id } = req.params;
    const { author, content } = req.body;
    if (!author || !content) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const posts = readJSON(FORUM_FILE);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const newReply = {
        id: 'reply-' + Date.now(),
        author,
        content,
        timestamp: new Date().toISOString()
    };

    posts[postIndex].replies.push(newReply);
    writeJSON(FORUM_FILE, posts);
    res.json({ success: true, reply: newReply });
});

// Edit a post
app.put('/api/forum/:id', (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Missing content' });
    }

    const posts = readJSON(FORUM_FILE, []);
    const postIndex = posts.findIndex(p => p.id === id);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    posts[postIndex].content = content;
    writeJSON(FORUM_FILE, posts);
    res.json({ success: true, post: posts[postIndex] });
});

// Delete a post (Admin or Author)
app.delete('/api/forum/:id', (req, res) => {
    const { id } = req.params;
    let posts = readJSON(FORUM_FILE, []);
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== id);

    if (posts.length !== initialLength) {
        writeJSON(FORUM_FILE, posts);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

// Delete a reply
app.delete('/api/forum/:postId/replies/:replyId', (req, res) => {
    const { postId, replyId } = req.params;
    const posts = readJSON(FORUM_FILE, []);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }

    const post = posts[postIndex];
    if (!post.replies) {
        return res.status(404).json({ error: 'Reply not found' });
    }

    const initialLength = post.replies.length;
    post.replies = post.replies.filter(r => r.id !== replyId);

    if (post.replies.length !== initialLength) {
        writeJSON(FORUM_FILE, posts);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Reply not found' });
    }
});

// Start the server (Moved to end to ensure all routes are registered)
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
