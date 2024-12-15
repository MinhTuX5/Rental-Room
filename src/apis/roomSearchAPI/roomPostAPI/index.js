import CrudAPI from "@/apis/crudAPI";

const END_POINT = "RoomPosts";
class RoomPostAPI extends CrudAPI {
  constructor() {
    super(END_POINT); // Gọi constructor của lớp cha
  }

  // Phương thức tìm kiếm phòng theo tiêu chính
  lovePost(favoritePostParam) {
    try {
      const res = this.postAsync(favoritePostParam, "/favorite-post");
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new RoomPostAPI();
