const connection = require("../config/config");
const query = (sql, values) => {
  return new Promise(function (resolve, reject) {
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  });
};

exports.findComment = (boardId) => {
  // const sql = `SELECT * FROM comment LEFT JOIN board ON board.board_id = comment.board_id WHERE board.board_id = ? AND comment.is_delete = ?;`;
  const sql = `SELECT comment.*, comment.updatedAt AS board FROM comment LEFT JOIN board ON board.board_id = comment.board_id WHERE board.board_id = ? AND comment.is_delete = ?;`;
  const values = [boardId, 1];
  return query(sql, values);
};

exports.writeComment = (board_id, comment_content, nickname) => {
  const sql = `INSERT INTO comment (board_id, comment_content, nickname, createdAt, updatedAt) VALUES (?,?,?,?,?);`;
  const values = [board_id, comment_content, nickname, new Date(), new Date()];
  return query(sql, values);
};

exports.editComment = (comment_content, nickname, commentIdx) => {
  const sql = `UPDATE comment SET comment_content = ?, updatedAt = ? WHERE comment_id = ? AND nickname = ?;`;
  const values = [comment_content, new Date(), commentIdx, nickname];
  return query(sql, values);
};

exports.checkCommentId = (commentIdx) => {
  const sql = `SELECT * FROM comment WHERE comment_id = ?`;
  const values = commentIdx;
  return query(sql, values);
};

exports.updateDelete = (commentIdx) => {
  const sql = `UPDATE comment SET is_delete = 0 WHERE comment_id =?;`;
  const values = commentIdx;
  return query(sql, values);
};
