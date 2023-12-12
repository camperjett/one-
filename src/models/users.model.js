module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    // customer_id: {
    //   type: Sequelize.INTEGER,
    //   allownull: false,
    //   primarykey: true,
    //   autoincrement: true,
    // },
    first_name: {
      type: Sequelize.STRING // https://sequelize.org/docs/v6/core-concepts/model-basics/#data-types
    },
    last_name: {
      type: Sequelize.STRING
    },
    phone_number: {
      type: Sequelize.BIGINT
    },
    monthly_income: {
      type: Sequelize.INTEGER
    },
    approved_limit: {
      type: Sequelize.INTEGER
    },
    current_debt: {
      type: Sequelize.FLOAT
    },
    age: {
      type: Sequelize.INTEGER
    }
  });
  // User.associate = function (models) {
  //   User.hasmany(models.loans, {
  //     foreignkey: 'customer_id'
  //   });
  // };
  return User
};