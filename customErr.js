class CustomErr extends Error {
  constructor(message, status) {
    super(message); // message는 기존 클래스에 있는 속성
    // status를 추가해서 커스텀에러를 만들어줌
    this.status = status;
  }
}
module.exports = CustomErr;
