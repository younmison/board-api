const express = require("express");
const app = express();
const cors = require("cors");

const { UserRouter, BoardRouter, CommentRouter } = require("./routes/index.js");
const handleError = require("./handleErr.js");
const { verifyToken } = require("./verifyToken.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(verifyToken);
app.use("/user", UserRouter);
app.use("/board", BoardRouter);
app.use("/comment", CommentRouter);

app.use(handleError.handleError);

app.listen(8000, () => {
  console.log("Server is running");
});
