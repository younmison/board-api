const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");

router.get("/list", boardController.list);
router.get("/list/:id", boardController.detail);
router.post("/edit", boardController.edit);
router.post("/write", boardController.write);
router.get("/delete/:id", boardController.delete);

module.exports = router;
