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

// Defining a user model
var User = sequalize.define('user', {
	email: Sequelize.STRING
})

// Define the relationships between objects
Todo.belongsTo(User);
User.hasMany(Todo);

// Sync model to the databse. Force true clears the table.
sequalize.sync({
	//	force: true
	}).then (function() {
	console.log('Everything is synced');

	// User.create({
	// 	email: 'Moppy@mop.com'

	// }).then( function() {
	// 	return Todo.create({
	// 		description: 'Clean yard'
	// 	})

	// }).then(function(todo) {
	// 	User.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	});
	// });

	User.findById(1).then(function(user) {
		user.getTodos({
			where: {
				completed: false
			}
		}).then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON());
			})
		})
	})
});
