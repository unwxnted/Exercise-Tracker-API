const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const port = 3000; 

const users = [];
const exercises = [];

app.use(cors({optionsSuccessStatus: 200}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = {
    username,
    _id: `user_${users.length + 1}`,
  };
  users.push(newUser);
  res.json(newUser);
});


app.get('/api/users', (req, res) => {
  res.json(users);
});


app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;

  const user = users.find((u) => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const exercise = {
    username: user.username,
    description: description,
    duration: parseInt(duration),
    date: date || new Date().toDateString(),
    _id: `exercise_${exercises.length + 1}`,
  };
  exercises.push(exercise);

  const response = {
    username: user.username,
    _id: user._id,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date
  }

  res.json(response);
});


app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const user = users.find((u) => u._id === _id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const log = exercises.filter((exercise) => exercise.username === user.username);

  res.json({
    username: user.username,
    count: log.length,
    log,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
