const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");

router.get("/:id", commentController.detail);
router.post("/write", commentController.write);
router.post("/edit", commentController.edit);
router.get("/delete/:id", commentController.delete);

module.exports = router;
