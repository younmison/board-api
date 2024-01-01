const userService = require("../services/userService");
const Response = require("../response.js");
const CustomErr = require("../customErr");
const bcrypt = require("bcrypt");

// 아이디 중복체크
exports.checkId = async (req, res, next) => {
  const response = new Response(res);
  try {
    // trim() 같은 함수는 최대한 변수안에 쓰지 않도록 주의
    // 예외처리 하는 로직안에서 처리하는 것이 좋음, 다른 곳도 마찬가지**
    const userId = req.params?.id;
    if (userId.length == 0 || userId == undefined) {
      return next(new CustomErr("invalid parameter", 400));
    }
    // const userId = req.params.id?.trim();
    // if (userId.length == 0 || userId == undefined) {
    //   return next(new CustomErr("invalid parameter", 400));
    // }
    const checkResult = await userService
      .checkId(userId)
      .then((res) => res)
      .catch((err) => err);
    if (checkResult.length !== 0) {
      return next(new CustomErr("Already Exist", 400));
    }
    return response.send("Avaliable Id", 200, null);
  } catch (err) {
    next(err);
  }
};

// 닉네임 중복체크
exports.checkName = async (req, res, next) => {
  const response = new Response(res);
  try {
    const nickname = req.params.name.trim();
    if (nickname.length == 0 || nickname == undefined) {
      return next(new CustomErr("invalid parameter", 400));
    }
    const checkResult = await userService
      .checkName(nickname)
      .then((res) => res)
      .catch((err) => err);
    if (checkResult.length !== 0) {
      return next(new CustomErr("Already Exist", 400));
    }
    return response.send("Avaliable nickname", 200, null);
  } catch (err) {
    next(err);
  }
};

exports.join = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { id, nickname, password, question, answer } = req.body;
    if (
      id === undefined ||
      nickname === undefined ||
      password === undefined ||
      question === undefined ||
      answer === undefined ||
      id.length === 0 ||
      nickname.length === 0 ||
      password.length === 0 ||
      question.length === 0 ||
      answer.length === 0
    ) {
      return next(new CustomErr("invalid value", 400));
    }
    const hashPw = await userService
      .hashPassword(password)
      .then((res) => res)
      .catch((err) => err);
    const checkResult = await userService
      .join(id, nickname, hashPw, question, answer)
      .then((res) => res)
      .catch((err) => err);

    if (checkResult !== undefined) {
      return response.send("Join Success", 200, null);
    }
    return next(new CustomErr("Join Failed", 404));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { id, password } = req.body;
    if (id == undefined || password == undefined || id.length == 0 || password.length == 0) {
      return next(new CustomErr("Parameter is not avaliable", 400));
    }
    const result = await userService
      .login(id)
      .then((res) => res)
      .catch((err) => err);
    if (result.length == 0) {
      return next(new CustomErr("user info does not exist", 404));
    }
    const hashedpw = Object.values(JSON.parse(JSON.stringify(result)))[0].password;
    const syncPw = await userService
      .checkpw(password, hashedpw)
      .then((res) => res)
      .catch((err) => err);
    if (syncPw) {
      const loginToken = await userService
        .loginToken(id)
        .then((res) => res)
        .catch((err) => err);
      const username = result[0].nickname;
      return response.send("Login Success", 200, { username, loginToken });
    }
    return next(new CustomErr("password not matched", 400));
  } catch (err) {
    next(err);
  }
};

// 비밀번호 답변 체크
exports.checkAnswer = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { question, answer, account } = req.body;
    if (answer === undefined || answer.length == 0 || question === undefined || account === undefined) {
      return next(new CustomErr("invalid value", 400));
    }
    const result = await userService
      .findAnswer(String(question), answer, account)
      .then((res) => res)
      .catch((err) => err);
    if (result.length == 0) {
      return next(new CustomErr("no result", 404));
    }
    const userToken = await userService
      .getToken(account)
      .then((res) => res)
      .catch((err) => err);
    return response.send("user get token", 200, userToken);
  } catch (err) {
    next(err);
  }
};

// 비밀번호 재설정
exports.newPassword = async (req, res, next) => {
  const response = new Response(res);
  try {
    const { userToken, password, account } = req.body;
    if (password == undefined || password.length == 0 || account == undefined || account.length == 0) {
      return next(new CustomErr("invalid value", 400));
    }
    // 토큰 검증
    const verifyToken = await userService
      .checkToken(userToken, account)
      .then((res) => res)
      .catch((err) => err);
    if (verifyToken) {
      const hashPw = await userService
        .hashPassword(password)
        .then((res) => res)
        .catch((err) => err);
      const checkResult = await userService
        .checkId(account)
        .then((res) => res)
        .catch((err) => err);
      if (checkResult.length == 0) {
        return next(new CustomErr("no validate account", 400));
      }
      const result = await userService
        .updatePassword(hashPw, account)
        .then((res) => res)
        .catch((err) => err);
      if (result.length == 0) {
        return next(new CustomErr("no result", 404));
      }
      return response.send("New Password is confirmed", 200, null);
    }
    return next(new CustomErr("token is not validate", 400));
  } catch (err) {
    next(err);
  }
};
