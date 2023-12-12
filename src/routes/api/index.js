const express = require("express");
const router = express.Router();
const userController = require("../../controllers/user/user.controller");

router.post("/register", userController.validate('register'), userController.registerUser);
// router.post("/check-eligibility", excelController.uploadLoan);
// router.post("/create-loan", userController.createLoan);
router.get("/view-loan/:loan_id", userController.getLoanDetails);
router.post("/make-payment/:customer_id/:loan_id", userController.validate('makePayment'), userController.makePayment);
router.get("/view-statement/:customer_id/:loan_id", userController.viewStatement);


module.exports = router;