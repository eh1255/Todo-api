module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user',{
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,			// Automatically ensures no duplicates can be made
			validate: {
				isEmail: true
			}
		},

		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				len: [7,100]
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
		}
	})
}