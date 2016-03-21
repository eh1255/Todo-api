var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); // Documentiation http://underscorejs.org/#where
var db = require('./db.js');
var bcrypt = require('bcrypt');


var app = express();
var PORT = process.env.PORT || 3000;

var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// API Basics: CRUD
// Create
// Read
// Update
// Delete

// GET /todos?completed=true&q=queryString
app.get('/todos', function(req, res) {
	// var queryParams = req.query;
	// var filteredTodos = todos;

	// // If has property and is completed. Note that completed is a string
	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});

	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// // Check if the q property exists and isn't empty
	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1; // -1 indicates the result wasn't contained
	// 	});
	// }

	// res.json(filteredTodos);

	var query = req.query; console.log(query);
	var where = {};

	// If the query specifies completeness
	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true
	} else if (query.hasOwnProperty('completed') && query.completed === 'false'){

	}

	// If the query specifies a string
	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {$like: '%'+query.q+'%'}
	}

	// Get that trash
	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	}).catch(function(error){
		res.status(500).send();
	});
});

// GET /todos/:id (the : represents a variable that will be passed in)
app.get('/todos/:id', function(req, res) {
	// var todoId = parseInt(req.params.id, 10); // The request value comes in as a string so it has to be converted to a base 10 number

	// // Filter for the object with that id. See http://underscorejs.org/#findWhere
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send(); // 404 error means not found
	// }

	var todoId = parseInt(req.params.id, 10);

	db.todo.findById(todoId).then(function(todo){
		if (todo) {
			res.json(todo);
		} else {
			res.status(400).send();	// 400 = bad data
		}
	}).catch(function(error){
		res.status(500).send();		// 500 = generic error on the server side
	})
});

// POST /todos
app.post('/todos', function(req, res) {

	// // _.pick() pulls off only the info you're interested
	// // trim() removes leading and trailing spaces
	// var body = _.pick(req.body, 'description', 'completed');
	// console.log(body);

	// // Validate the data. 
	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send(); // 400 means bad data and response couldn't be completed
	// }

	// // Add the new todo item to the todo items array
	// body.description = body.description.trim();
	// body.id = todoNextId++; // set first, then increment
	// todos.push(body);

	// // Send a JSON response 
	// res.json(body);

	var body = _.pick(req.body, 'description', 'completed');
	
	db.todo.create(body).then(function(todo){
		res.json(todo);
	}).catch(function(error){
		res.status(400).json(error);	// 400 means bad data
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	// var todoId = parseInt(req.params.id, 10); // The request value comes in as a string so it has to be converted to a base 10 number
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (!matchedTodo) {
	// 	return res.status(404).json({
	// 		"error": "no todo with that id"
	// 	});
	// } else {
	// 	// _.without(array, value1, value2,...) returns an array with specified values removed
	// 	todos = _.without(todos, matchedTodo);
	// 	res.json(matchedTodo); // json automatically sets status to 200 (okay)
	// }

	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function (numRowsDeleted) {
		// If nothing was deleted
		if (numRowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with that id'
			});
		// If something was deleted
		} else {
			res.status(204).send(); // 204 is a good response with no data attached
		}

	// An error occurred
	}, function() {
		res.status(500).send();
	});

	// This is an alternate implementation
	// db.todo.findById(todoId).then(function(todo){
	// 	// If successfully found
	// 	todo.destroy();
	// 	res.json(todo);
	// }, function() {
	// 	// If not found
	// 	res.status(404).send();
	// }).catch(function(error){
	// 	res.status(500).send();
	// });
});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {

	// // Find the specified item
	// var todoId = parseInt(req.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// // Stop now if nothing was found
	// if (!matchedTodo) {
	// 	return res.status(404).send();
	// }

	// // Get the json from the request
	// var body = _.pick(req.body, 'description', 'completed');
	// var validAttributes = {};

	// // Validate completed
	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	// 	// Has the property and is a boolean
	// 	validAttributes.completed = body.completed;

	// } else if (body.hasOwnProperty('completed')) {
	// 	// Had the proprty, but it wasn't a boolean
	// 	return res.status(400).send();
	// }

	// // Validate description
	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
	// 	validAttributes.description = body.description;
	// } else if (body.hasOwnProperty('description')) {
	// 	return res.status(400).send();
	// }

	// // If we make it to here, everything went well
	// // .ext add/overwrites new data to an object
	// _.extend(matchedTodo, validAttributes);
	// return res.status(200).send(matchedTodo);

	// Find the specified item
	var todoId = parseInt(req.params.id, 10);	
	var body   = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')){
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// Search for the object by id
	db.todo.findById(todoId).then(function(todo) {
		
		// Search completed successfully, result is todo:Todo?
		// If not nil, update and pass back
		// If nil, send no data response
		if (todo) {
			todo.update(attributes).then(function(todo){
				res.json(todo);
			}, function(error){
				res.status(400).json(error);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		// Search did not complete. Send server error
		res.status(500).send();
	})

});

// POST /users
app.post('/users', function(req, res) {
	
	// Get the body with only email and password included
	var body = _.pick(req.body, 'email', 'password');

	// Create a user with those values
	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	}, function(error){
		res.status(400).json(error);
	})
});

// POST /users/login
app.post('/users/login', function(req, res) {

	// Get the body with only email and password included
	var body = _.pick(req.body, 'email', 'password');

	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		if (token) {
			res.header('Auth', token).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}
	}, function (error){
		res.status(401).send();
	});
});

// Now that all the functionality has been pinned on, start the server
db.sequelize.sync({force: true}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
