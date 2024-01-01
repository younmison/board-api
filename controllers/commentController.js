const commentService = require("../services/commentService");
const Response = require("../response.js");
const CustomErr = require("../customErr");

exports.detail = async (req, res, next) => {
  const response = new Response(res);
  try {
    let boardId = req.params.id.trim();
    if (boardId == undefined || boardId.length == 0) {
      return next(new CustomErr("invalid value", 400));
    }
    const result = await commentService
      .findComment(boardId)
      .then((res) => res)
      .catch((err) => err);
    if (result.length === 0) {
      return next(new CustomErr("there is no comment", 404));
    }
    return response.send("Success", 200, result);
  } catch (err) {
    next(err);
  }
};

exports.write = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { board_id, comment_content, nickname } = req.body;
    if (
      board_id !== undefined &&
      comment_content !== undefined &&
      nickname !== undefined &&
      board_id.length !== 0 &&
      comment_content.length !== 0 &&
      nickname.length !== 0
    ) {
      const result = await commentService
        .writeComment(board_id, comment_content, nickname)
        .then((res) => res)
        .catch((err) => err);
      if (result.length !== 0) {
        return response.send("Success", 200, null);
      }
      return next(new CustomErr("failed", 404));
    }
    return next(new CustomErr("invalid value", 400));
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { comment_content, nickname, comment_id } = req.body;
    if (comment_id !== undefined && comment_content !== undefined && nickname !== undefined) {
      const checkIdx = await commentService
        .checkCommentId(comment_id)
        .then((res) => res)
        .catch((err) => err);
      if (checkIdx.length !== 0) {
        const commentIdx = Number(comment_id);
        const result = await commentService
          .editComment(comment_content, nickname, commentIdx)
          .then((res) => res)
          .catch((err) => err);
        if (result.length !== 0) {
          return response.send("Success", 200, null);
        }
        return next(new CustomErr("failed", 404));
      }
      return next(new CustomErr("no validate comment id", 404));
    }
    return response(res, "invalid value", 400, null);
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  const response = new Response(res);
  try {
    let commentId = req.params.id.trim();
    if (commentId == undefined && commentId.length == 0) {
      return response(res, "invalid value", 400, null);
    }
    const commentIdx = Number(commentId);
    const checkIdx = await commentService
      .checkCommentId(commentIdx)
      .then((res) => res)
      .catch((err) => err);
    const checkState = Object.values(JSON.parse(JSON.stringify(checkIdx)))[0].is_delete;
    if (checkState == 1) {
      const result = await commentService
        .updateDelete(commentIdx)
        .then((res) => res)
        .catch((err) => err);
      if (result.length !== 0) {
        return response.send("Delete successful", 200, null);
      }
      return next(new CustomErr("Delete failed", 404));
    }
    return next(new CustomErr("no validate comment id", 404));
  } catch (err) {
    next(err);
  }
};
