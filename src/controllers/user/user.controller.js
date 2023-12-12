const db = require("../../models");
const User = db.users;
const Loan = db.loans;
const { body, validationResult } = require('express-validator')

exports.validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body('first_name', "First name doesn't exists").exists(),
        body('last_name', "Last name doesn't exists").exists(),
        body('age', "Age doesn't exits").isInt(),
        body('monthly_income', "Monthly income doesn't exits").isInt(),
        body('phone_number', "Phone number doesn't exits").isInt(),
      ]
    }
      break;
    case 'makePayment': {
      return [
        body('amount', "Amount doesn't exists").exists()
      ]
    }
      break;
  }
}

const getApprovedLimit = (monthly_income) => {
  let result = monthly_income * 36;
  if (result % 100000 >= 50000)
    result += 100000;
  result -= result % 100000;
  return result;
};

exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

    const { first_name, last_name, age, monthly_income, phone_number } = req.body;
    const approved_limit = getApprovedLimit(monthly_income);
    const user = await User.create({
      first_name,
      last_name,
      age,
      monthly_income,
      phone_number,
      approved_limit,
    })

    res.json(user);
  } catch (err) {
    return next(err);
  }
}

exports.getLoanDetails = async (req, res, next) => {
  try {
    const { loan_id } = req.params;
    const result = await Loan.findAll({
      where: {
        loan_id: loan_id
      }
    });
    if (result.length == 0) {
      res.status(404).send('Loan not found.');
      return;
    }
    const loan = result[0];
    const query = await User.findAll({
      where: {
        id: loan.userId
      }
    });
    const user = query[0];

    res.send({
      loan_id: loan_id,
      customer: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        age: user.age
      },
      loan_amount: loan.loan_amount,
      interest_rate: loan.interest_rate,
      monthly_installment: loan.monthly_repayment,
      tenure: loan.tenure,
    });
  } catch (err) {
    return next(err);
  }
};

const getRemaining = (targetDate) => {
  const finalDate = targetDate.split('-');
  const today = new Date();
  const targetDateOM = Number(finalDate[2]);
  const targetMonth = Number(finalDate[1]);
  const targetYear = Number(finalDate[0]);
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  let monthsLeft = (targetYear - currentYear) * 12;
  monthsLeft += targetMonth - currentMonth;

  if (today.getDate() > targetDateOM) {
    monthsLeft--;
  }

  return monthsLeft;
};

const paidOnTime = (startDate) => {
  const today = new Date();
  const finalDate = startDate.split('-');
  const targetDate = finalDate[2];
  const currentDate = today.getDate();
  const targetMonth = finalDate[1];
  const currentMonth = today.getMonth() + 1;
  if (currentMonth != targetMonth)
    return currentMonth < targetMonth;
  return targetDate >= currentDate;
};

exports.makePayment = async (req, res, next) => {
  const { customer_id, loan_id } = req.params;
  /*
    if payment equals emi, update nothing,
    else update monthly_repayment as:
    (remain_tenure * emi - payment) / (remain_tenure - 1)
  */
  /*
     1. Assuming that all EMIs till date are paid.
     2. Assuming that if EMI is paid on date of month as start_date, it is on-time
       else not. this raises a question: what if we paid at the start of month.. (early)? is it not on-time? I assume that it is on-time
   */
  const queryLoan = await Loan.findAll({
    where: {
      loan_id: loan_id,
      userId: customer_id,
    }
  });
  if (queryLoan.length == 0) {
    res.status(404).send('loan entry not found');
    return;
  }
  const loan = queryLoan[0];
  const { amount } = req.body;
  const remaining = getRemaining(loan.end_date);
  // handle errors:
  // 1. amount > remaining_amount
  if (remaining * loan.monthly_repayment < amount) {
    res.status(404).send('amount exceeds the owed amount');
    return;
  }
  // 2. end_date already past
  if (remaining == 0) {
    res.status(404).send('End date for the loan already passed');
    return;
  }
  if (loan.monthly_repayment !== amount) {
    loan.monthly_repayment = Math.floor((remaining * loan.monthly_repayment - amount) / (remaining - 1));
    await Loan.update({
      monthly_repayment: loan.monthly_repayment
    },
      {
        where: {
          loan_id: loan_id,
          userId: customer_id,
        }
      });
  }
  if (paidOnTime(loan.start_date)) {
    await Loan.update({
      emis_paid_on_time: loan.emis_paid_on_time + 1
    },
      {
        where: {
          loan_id: loan_id,
          userId: customer_id,
        }
      });
  }
  res.status(200).send('payment successfull.');
  return;
};

exports.viewStatement = async (req, res, next) => {
  const { customer_id, loan_id } = req.params;
  const query = await Loan.findAll({
    where: {
      userId: customer_id,
      loan_id: loan_id
    }
  });
  if (query.length == 0) {
    res.status(404).send("loan not found.");
    next();
  }
  res.status(200).send(query);
};