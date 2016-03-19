var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET /todos/:id (the : represents a variable that will be passed in)
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);	// The request value comes in as a string so it has to be converted to a base 10 number
	var  matchedTodo;

	// Iterate over all todos looking for a match
	todos.forEach( function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});

	// If it was found, send it back.
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send(); // 404 error means not found
	}
});

// POST /todos
app.post('/todos', function(req, res){
	var body = req.body;
	console.log('description: ' + body.description);

	// Add the new todo item to the todo items array
	body.id = todoNextId++; // set first, then increment
	todos.push(body);

	res.json(body);
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


