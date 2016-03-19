var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');	// Documentiation http://underscorejs.org/#where

var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
	res.send('Todo API Root');
});

// API Basics: CRUD
// Create
// Read
// Update
// Delete

// GET /todos
app.get('/todos', function(req, res) {
	res.json(todos);
});

// GET /todos/:id (the : represents a variable that will be passed in)
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10);	// The request value comes in as a string so it has to be converted to a base 10 number
	
	// Filter for the object with that id. See http://underscorejs.org/#findWhere
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send(); // 404 error means not found
	}
});

// POST /todos
app.post('/todos', function(req, res){
	
	// _.pick() pulls off only the info you're interested
	// trim() removes leading and trailing spaces
	var body = _.pick(req.body, 'description', 'completed');
	console.log(body);
	
	// Validate the data. 
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
		return res.status(400).send(); // 400 means bad data and response couldn't be completed
	}

	// Add the new todo item to the todo items array
	body.description = body.description.trim();
	body.id = todoNextId++; // set first, then increment
	todos.push(body);

	// Send a JSON response 
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res){
	var todoId = parseInt(req.params.id, 10);	// The request value comes in as a string so it has to be converted to a base 10 number
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		return res.status(404).json({"error": "no todo with that id"}); 
	} else {
		// _.without(array, value1, value2,...) returns an array with specified values removed
		todos = _.without(todos, matchedTodo);
		res.json(matchedTodo); // json automatically sets status to 200 (okay)
	}
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res){
	
	// Find the specified item
	var todoId = parseInt(req.params.id, 10);	
	var matchedTodo = _.findWhere(todos, {id: todoId});
	
	// Stop now if nothing was found
	if (!matchedTodo) {
		return res.status(404).send();
	}

	// Get the json from the request
	var body = _.pick(req.body, 'description', 'completed');
	var validAttributes = {};

	// Validate completed
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		// Has the property and is a boolean
		validAttributes.completed = body.completed;
	
	} else if (body.hasOwnProperty('completed')){
		// Had the proprty, but it wasn't a boolean
		return res.status(400).send();
	} 

	// Validate description
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} 

	// If we make it to here, everything went well
	// .ext add/overwrites new data to an object
	_.extend(matchedTodo, validAttributes);
	return res.status(200).send(matchedTodo);
});


app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
});


