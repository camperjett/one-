const express = require("express");
const router = express.Router();
const excelController = require("../controllers/upload/excel.controller");
const upload = require("../middlewares/upload");

// let routes = (app) => {
router.post("/users", upload.single("file"), excelController.uploadUser);
router.post("/loans", upload.single("file"), excelController.uploadLoan);
// router.get("/users", excelController.getUsers);
// };

module.exports = router;