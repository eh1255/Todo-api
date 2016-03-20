var Sequelize = require('sequelize');								// Importing

// If on heroku (production) use postgres, otherwise use sqlite
var env = process.env.NODE_ENV || 'development';
var sequelize;

console.log('Running in environment: ' + env);

if (env === 'production') {
	sequelize = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres'
	});
} else {
	sequelize = new Sequelize(undefined, undefined, undefined, {
		'dialect': 'sqlite',
		'storage': __dirname + '/data/dev-todo-api.sqlite'
	});
}

// Only one thing can be exported, so we make it an object and give it multiple attributes
var db = {};

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
