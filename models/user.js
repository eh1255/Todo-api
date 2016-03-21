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
	})
}