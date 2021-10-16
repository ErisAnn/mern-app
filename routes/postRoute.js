const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const auth = require("../middleware/auth")();

router.get("/mypost", auth.authenticate(), postController.get_post);

module.exports = router;