import BaseAPI from "@/apis/baseAPI";

const END_POINT = "Users/";

class ProfileAPI extends BaseAPI {
  constructor() {
    super(END_POINT);
  }

  getProfile(userId) {
    return this.getAsync({}, `profile/${userId}`);
  }

  updateProfile(payload) {
    return this.postAsync(payload, "profile/update");
  }
}

export default new ProfileAPI();
