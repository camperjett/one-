module.exports = (sequelize, Sequelize) => {
  const Loan = sequelize.define("loan", {
    // customer_id: {
    //   type: Sequelize.INTEGER,
    //   // references: {
    //   //   model: 'users', // 'users' refers to table name
    //   //   key: 'customer_id', // 'customer_id' refers to column name in users table
    //   // }
    // },
    loan_id: {
      type: Sequelize.INTEGER
    },
    loan_amount: {
      type: Sequelize.FLOAT
    },
    tenure: {
      type: Sequelize.INTEGER
    },
    interest_rate: {
      type: Sequelize.FLOAT
    },
    monthly_repayment: {
      type: Sequelize.INTEGER
    },
    emis_paid_on_time: {
      type: Sequelize.INTEGER
    },
    start_date: {
      type: Sequelize.DATEONLY
    },
    end_date: {
      type: Sequelize.DATEONLY
    }
  });

  // Loan.associate = function (models) {
  //   Loan.belongsto(models.users, {
  //     foreignkey: 'customer_id',
  //     ondelete: 'cascade'
  //   });
  // };

  return Loan
};