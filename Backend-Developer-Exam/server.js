const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let todos = [];
let idCounter = 1;

// Get all data
app.get('/gettodolist', (req, res) => {
  res.json(todos);
});

// Get data by id
app.get('/gettodo/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');
  res.json(todo);
});

// Create new data
app.post('/createtodo', (req, res) => {
  const { title, completed } = req.body;
  const newTodo = {
    id: idCounter++,
    title,
    completed: completed || false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// Update data by id
app.put('/edittodo/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).send('Todo not found');

  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// Delete data by id
app.delete('/deletetodo/:id', (req, res) => {
  const index = todos.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Todo not found');

  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
