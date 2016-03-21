var bcrypt = require('bcrypt');
var _ = require('underscore');

module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define('user',{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,			// Automatically ensures no duplicates can be made
			validate: {
				isEmail: true
			}
		},

		salt: {
			type: DataTypes.STRING
		},

		password_hash: {
			type: DataTypes.STRING
		},


		password: {
			
			type: DataTypes.VIRTUAL,
			allowNull: false,
			
			validate: {
				len: [7,100]
			},

			set: function (value) {
				var salt = bcrypt.genSaltSync(10);
				var hashedPassword = bcrypt.hashSync(value, salt);

				this.setDataValue('password', value);
				this.setDataValue('salt', salt);
				this.setDataValue('password_hash', hashedPassword);
			}
		}
	}, {
		hooks: {
			beforeValidate: function(user, options) {
				// Convert email into lowercase iff it exists
				// No need for an else statement because validation will fail automatically because of the settings above
				if (typeof user.email === 'string') {
					user.email = user.email.toLowerCase();
				}
			}
		},

		classMethods: {
			authenticate: function(body) {
				return new Promise(function(resolve, reject){

					// If data is bad
					if (typeof body.email !== 'string' || typeof body.password !== 'string') {
						return reject();
					}

					// See if a user exists with that email
					user.findOne({
						where: {
							email: body.email
						}
					}).then(function(user){
						// Check if it found something and if it matches the salted and hashed password
						if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
							return reject();	// The call was correct, but nothing was found
						} 

						// If the password matched
						resolve(user);

					}, function(error){
						reject();
					});
				})
			}
		},

		instanceMethods:  {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id','email','createdAt','updatedAt');
			}
		},
	});

	return user
};