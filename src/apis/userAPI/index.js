import BaseAPI from "@/apis/baseAPI";

const END_POINT = "Auth/";

class UserAPI extends BaseAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  /**
   * API đăng nhập
   * @params user is an object, include
   * @returns res is a promise
   */
  login(user) {
    try {
      const res = this.postAsync(user, "login"); // post tới API login
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * API đăng nhập
   */
  loginCallback(payload) {
    try {
      const res = this.postAsync(payload, "login-callback"); // post tới API login-callback
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * API đăng ký
   * @params user is an object, include
   * @returns res is a promise
   */
  register(user) {
    try {
      const res = this.postAsync(user, "Register"); // post tới API Register
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  updateUserInfo(user) {
    try {
      const res = this.postAsync(user, "UpdateInformation");
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  changePassword(payload) {
    try {
      const res = this.postAsync(payload, "ChangePassword");
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new UserAPI();
