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

exports.countComment = (boardId) => {
  const sql =
    "SELECT COUNT(*) FROM comment LEFT JOIN board ON board.board_id = comment.board_id WHERE board.board_id = ? AND comment.is_delete = 1;";
  const values = boardId;
  return new Promise(function (resolve, reject) {
    connection.query(sql, values, (error, result) => {
      if (error) {
        reject(error);
      }
      const numbers = Object.values(JSON.parse(JSON.stringify(result)))[0]["COUNT(*)"];
      resolve(numbers);
    });
  });
};
exports.updateComment = (countComment, boardId) => {
  const sql = "UPDATE board SET comment_count = ?  WHERE board_id = ?;";
  const values = [countComment, boardId];
  return query(sql, values);
};

exports.boardCountAll = () => {
  const sql = "SELECT COUNT(*) as count FROM board;";
  return new Promise(function (resolve, reject) {
    connection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(Object.values(JSON.parse(JSON.stringify(result)))[0].count);
    });
  });
};

exports.countSearchTitle = (value) => {
  const sql = "SELECT COUNT(*) as count from board WHERE title LIKE ?";
  const values = `%${value}%`;
  return query(sql, values);
};

exports.searchTitle = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE title LIKE ? ORDER BY createdAt desc LIMIT ?, ?;`;
  const values = [`%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.countSearchContent = (value) => {
  const sql = `SELECT COUNT(*) as count from board WHERE content LIKE ?`;
  const values = `%${value}%`;
  return query(sql, values);
};

exports.searchContent = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE content LIKE ? ORDER BY createdAt desc LIMIT ?, ?;`;
  const values = [`%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.countSearchAll = (value) => {
  const sql = "SELECT COUNT(*) as count from board WHERE title LIKE ? OR content LIKE ?";
  const values = [`%${value}%`, `%${value}%`];
  return query(sql, values);
};

exports.searchAll = (pageSize, pageNum, value) => {
  const sql = `SELECT * from board WHERE title LIKE ? OR content LIKE ? ORDER BY createdAt desc LIMIT ?, ?;`;
  const values = [`%${value}%`, `%${value}%`, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.getList = (pageSize, pageNum) => {
  const sql = `SELECT * from board WHERE is_delete = ? ORDER BY createdAt desc LIMIT ?, ?;`;
  const values = [1, (pageNum - 1) * pageSize, pageSize];
  return query(sql, values);
};

exports.detail = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ?`;
  const values = boardId;
  return query(sql, values);
};

exports.write = (title, content, writer) => {
  const sql =
    "INSERT INTO board (title, content, hits, comment_count, writer, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?)";
  const values = [title, content, 0, 0, writer, new Date(), new Date()];
  return query(sql, values);
};

exports.edit = (title, content, boardIndex) => {
  const sql = `UPDATE board SET title = ?,content = ?, updatedAt = CURRENT_TIMESTAMP WHERE board.board_id = ? ;`;
  const values = [title, content, boardIndex];
  return query(sql, values);
};

exports.checkBoardId = (boardId) => {
  const sql = `SELECT * FROM board WHERE board_id = ?`;
  const values = boardId;
  return query(sql, values);
};

exports.updateDelete = (boardId) => {
  const sql = `UPDATE board SET is_delete = 0 WHERE board_id =?;`;
  const values = boardId;
  return query(sql, values);
};

exports.addhitsNum = (number, boardId) => {
  const sql = "UPDATE board SET hits = ? + 1 WHERE board_id = ?;";
  const values = [number, boardId];
  return query(sql, values);
};
