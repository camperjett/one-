const readXlsxFile = require("read-excel-file/node");
const db = require("../../models");
const User = db.users;
const Loan = db.loans;

const uploadUser = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let users = [];

      rows.forEach((row) => {
        let user = {
          id: row[0],
          first_name: row[1],
          last_name: row[2],
          age: row[3],
          phone_number: row[4],
          monthly_income: row[5],
          approved_limit: row[6],
        };

        users.push(user);
      });

      User.bulkCreate(users)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const uploadLoan = async (req, res) => {
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    let path =
      __basedir + "/resources/static/assets/uploads/" + req.file.filename;
    readXlsxFile(path).then((rows) => {
      // skip header
      rows.shift();

      let loans = [];

      rows.forEach((row) => {
        let loan = {
          userId: row[0],
          loan_id: row[1],
          loan_amount: row[2],
          tenure: row[3],
          interest_rate: row[4],
          monthly_repayment: row[5],
          emis_paid_on_time: row[6],
          start_date: row[7],
          end_date: row[8]
        };

        loans.push(loan);
      });

      Loan.bulkCreate(loans)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database!",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
};

const getUsers = (req, res) => {
  User.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users.",
      });
    });
};

module.exports = {
  uploadUser,
  uploadLoan,
  getUsers,
};