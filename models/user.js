var bcrypt = require('bcrypt');
var _ = require('underscore');
var cryptojs = require('crypto-js');
var jwt = require('jsonwebtoken');

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
			},

			findByToken: function(token) {
				return new Promise(function(resolve, reject){
					try {
						
						var decodedJWT = jwt.verify(token, 'qwerty098');
						var bytes = cryptojs.AES.decrypt(decodedJWT.token, 'abc123!"#$%');
						var tokenData = JSON.parse(bytes.toString(cryptojs.enc.Utf8));

						// Find the user with the id
						user.findById(tokenData.id).then(function(user){
							if (user) {
								resolve(user);
							} else {
								reject();
							}
						}, function (error){
							console.log('couldnt find user with that id');
							reject(error);
						})
					} catch (error) {
						console.log('Issue getting token data');
						reject(error);
					}
				});
			}
		},

		instanceMethods:  {
			toPublicJSON: function() {
				var json = this.toJSON();
				return _.pick(json, 'id','email','createdAt','updatedAt');
			},

			generateToken: function(type) {
				if (!_.isString(type)) {
					return undefined;
				}

				// Create a new JASON web token with encryption
				try {
					
					// encrypt the id and token type
					var stringData = JSON.stringify({id: this.get('id'), type: type});
					var encryptedData = cryptojs.AES.encrypt(stringData, 'abc123!"#$%').toString();
					var token = jwt.sign({
						token: encryptedData
					}, 'qwerty098');


					return token

				} catch (error) {
					return undefined
				}
			}
		},
	});

	return user
};