export default class BaseStore {
  constructor(api) {
    const me = this;
    me.state = {};
    me.actions = {
      async getById(id) {
        const response = await api.getById(id);
        return response;
      },

      async getAllRecords(keyWord) {
        const response = await api.getAsync({ keyWord });
        return response;
      },

      /**
       * @description Phân trang
       * @param {Object} config {Skip, Take, Columns, Filters}
       * @returns {Object} {data: []}
       */
      async getPaging(config) {
        const response = await api.getPaging(config);
        return {
          data: response.data,
          totalCount: response?.data.length ?? 0,
        };
      },

      /**
       * @description Thêm mới
       * @param {Object} config
       */
      async insertAsync(config) {
        const response = await api.postAsync(config);
        return response;
      },

      /**
       * @description Xóa
       * @param {Object} config
       */
      async deleteAsync(id) {
        const response = await api.deleteAsync(id);
        return response;
      },
    };
  }
}
