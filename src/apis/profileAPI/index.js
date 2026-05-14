import BaseAPI from "@/apis/baseAPI";

const END_POINT = "Users/";

class ProfileAPI extends BaseAPI {
  constructor() {
    super(END_POINT);
  }

  getProfile(userId) {
    return this.getAsync({}, `profile/${userId}`);
  }

  updateProfile(userId, payload) {
    return this.putAsync(payload, `profile/${userId}`);
  }

  changePassword(userId, payload) {
    return this.putAsync(payload, `change-password/${userId}`);
  }
}

export default new ProfileAPI();
