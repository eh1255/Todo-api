var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'go to market',
	completed: false
}, {
	id: 3,
	description: 'brush teeth',
	completed: true
}];

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
	})

	// If it was found, send it back.
	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send(); // 404 error means not found
	}


	res.send('Asking for todo with id of ' + req.params.id);
});

app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


