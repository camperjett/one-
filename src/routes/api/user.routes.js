const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");

router.post("/register", userController.validate('register'), userController.registerUser);
// router.post("/check-eligibility", excelController.uploadLoan);
// router.post("/create-loan", excelController.uploadLoan);
// router.post("/view-loan", excelController.uploadLoan);
// router.post("/check-eligibility", excelController.uploadLoan);
// router.post("/make-payment/:customer_id/:loan_id", excelController.uploadLoan);
// router.post("/view-statement/:customer_id/:loan_id", excelController.uploadLoan);


module.exports = router;