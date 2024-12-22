import CrudAPI from "@/apis/crudAPI";

const END_POINT = "RoomPosts";
class RoomPostAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  lovePost(favoritePostParam) {
    try {
      const res = this.postAsync(favoritePostParam, "/favorite-post");
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * @description Lấy danh sách các bài đã đăng
   * @param {String} userID
   */
  async getMyPosts(userID) {
    try {
      const res = await this.getAsync(null, `/my-posts/${userID}`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  }

    /**
   * @description Lấy danh sách các bài đã yêu thích
   * @param {String} userID
   */
    async getMyFavoritePosts(userID) {
      try {
        const res = await this.getAsync(null, `/my-favorite-posts/${userID}`);
        return res.data;
      } catch (error) {
        console.log(error);
      }
    }

  /**
   * @override
   * @param {Object} config {PagingItem, FilterVals}
   */
  async getPaging(config) {
    try {
      var response = await this.postAsync(config, `/filter-list`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default new RoomPostAPI();
