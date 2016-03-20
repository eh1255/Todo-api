var Sequelize = require('sequelize');	// Importing

// Creating an instance of the database
var sequalize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'	// put it in the same folder. This is the name of the new file
});		

// Defining the data model
var Todo = sequalize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})	

// Sync model to the databse. Force true clears the table.
sequalize.sync({
		//force: true
	}).then (function() {
	console.log('Everything is synced');

	// Create a new object
	Todo.create({
		description: 'Take out trash'
	}).then(function(todo){
		return Todo.create({
			description: 'Clean office'
		});
	
	// Fetch saved objects
	}).then(function(){
		//return Todo.findById(1); // just the item with id 1
		return Todo.findAll({
			where: {
				description: {
					$like:'%Office%'	// The % mean anything can come before or after. Not case sensitive.
				}
			}
		})
	}).then(function(todos){
		if (todos) {
			todos.forEach( function(todo) {
				console.log(todo.toJSON()); // toJSON just makes it more readable
			})
		}

	// Log any errors
	}).catch(function(error){
		console.log(error);
	});




	// Fetch object with specific id 
	Todo.findById(2).then(function(todo){
		console.log(todo.toJSON());
	}).catch(function(error){
		console.log(error);
	});
});
