const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

exports.checkId = (userId) => {
  const sql = `SELECT * FROM user WHERE account = ?`;
  const values = userId;
  return query(sql, values);
};

exports.checkName = (nickname) => {
  const sql = `SELECT * FROM user WHERE nickname= ?`;
  const values = nickname;
  return query(sql, values);
};

exports.hashPassword = (password) => {
  return new Promise(function (resolve, reject) {
    resolve(bcrypt.hash(password, 10));
  });
};

exports.join = (id, nickname, hashPw, question, answer) => {
  const sql = `INSERT INTO user (account, nickname, password, pw_question, pw_answer, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?);`;
  const values = [id, nickname, hashPw, question, answer, new Date(), new Date()];
  return query(sql, values);
};

exports.login = (id) => {
  const sql = `SELECT * FROM user WHERE account = ?;`;
  const values = id;
  return query(sql, values);
};

exports.checkpw = (password, hashedpw) => {
  return new Promise(function (resolve, reject) {
    // 해싱한 값끼리 비교 -> 해싱한 값들이 일치하는지?
    bcrypt.compare(password, hashedpw, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

exports.loginToken = (id) => {
  return new Promise(function (resolve, reject) {
    jwt.sign({ username: `${id}` }, process.env.SECRET_KEY, { expiresIn: "3h" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve({ token, id });
    });
  });
};

exports.getToken = (account) => {
  return new Promise(function (resolve, reject) {
    jwt.sign({ username: `${account}` }, process.env.SECRET_KEY, { expiresIn: "3m" }, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve({ token, account });
    });
  });
};

exports.checkToken = (userToken, account) => {
  return new Promise(function (resolve, reject) {
    jwt.verify(userToken, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return reject(false);
      }
      if (decoded.username === account) {
        return resolve(true);
      }
      reject(false);
    });
  });
};

exports.findAnswer = (question, answer, account) => {
  const sql = `SELECT * FROM user WHERE pw_question = ? AND pw_answer = ? AND account = ? ;`;
  const values = [question, answer, account];
  return query(sql, values);
};

// 이름바꾸기
exports.updatePassword = (hashPw, account) => {
  const sql = `UPDATE user SET password = ? WHERE account = ? ;`;
  const values = [hashPw, account];
  return query(sql, values);
};
