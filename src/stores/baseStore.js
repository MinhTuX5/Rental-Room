export default class BaseStore {
  constructor(api) {
    const me = this;
    me.state = {};
    me.actions = {
      //#region Get
      async getById(id) {
        const response = await api.getById(id);
        return response;
      },

      async getAll() {
        const response = await api.getAsync();
        return response?.data ?? [];
      },

      afterGetPaging(result) {
        if (Array.isArray(me.state.items)) {
          me.state.items = result.data;
        }
      },

      /**
       * @description Phân trang
       * @param {Object} config {Skip, Take, Columns, Filters}
       * @returns {Object} {data: []}
       */
      async getPaging(config) {
        const me = this;
        const response = await api.getPaging(config);
        var result = {
          data: response.data,
          totalCount: response.totalCount ?? 0,
        };
        me.afterGetPaging(result);
        return result;
      },
      //#endregion

      afterInsertAsync(item) {},
      /**;
       * @description Thêm mới
       * @param {Object} config
       */
      async insertAsync(config) {
        const me = this;

        const response = await api.postAsync(config);
        me.afterInsertAsync(response.data);
        return response.data;
      },

      afterUpdate(item) {},
      /**;
       * @param {Object} config
       */
      async putAsync(config) {
        const me = this;
        const response = await api.putAsync(config);
        me.afterUpdate(response.data);
        return response.data;
      },

      afterDeleteAsync(id) {},
      /**
       * @description Xóa
       * @param {Object} config
       */
      async deleteAsync(id) {
        const me = this;
        const response = await api.deleteAsync(id);
        me.afterDeleteAsync(id);
        return response;
      },

      async getNew() {
        const response = await api.getNew();
        return response;
      },
    };
  }
}
