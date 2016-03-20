var Sequelize = require('sequelize');								// Importing
var sequelize = new Sequelize(undefined, undefined, undefined, {	// Creating an instance of the database
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-todo-api.sqlite'	// put it in the same folder. This is the name of the new file
});	

// Only one thing can be exported, so we make it an object and give it multiple attributes
var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
