import { cloneDeep } from "lodash";
import moment from "moment";
// base
import baseList from "./baseList";
// resources
import popupUtil from "../../common/popupUtil";
import { formatNumberWithCommas } from "@/common/commonFunction";
import { useContextManageStore } from "@/stores/contextManageStore";
// enum
import _enum from "@/common/enum";
import { showMessage } from "@/common/commonFunction";

export default {
  name: "baseDicList",
  extends: baseList,
  props: {},
  data() {
    return {
      loading: true,
      detailForm: "",
      keyWord: "",
      mainViewPadding: 16,
      refToolBar: "refToolBar",
      itemsPerPage: 20,
      lastPagingParam: {},
    };
  },
  computed: {
    items() {
      const me = this;
      const data = this.store?.$state?.items ?? [];
      data.forEach((item) => {
        item = me.getDateItem(item, me.store?.$state.dateFields);
        item = me.getNumberItem(item, me.store?.$state.numberFields);
        item = me.getEnumItem(item, me.store?.$state.enumFields);
      });
      return data;
    },
    totalItems() {
      return this.store.$state?.totalItems ?? 0;
    },
    searchFields() {
      return this.store?.$state.searchFields ?? [];
    },
    defaultSorts() {
      return this.store.defaultSorts ?? [];
    },
    defaultFilters() {
      return this.store.defaultFilters ?? [];
    },
    activeBuildingId() {
      return useContextManageStore().$state.user?.building_id;
    },
    tableMaxHeight() {
      return (
        window.innerHeight -
        (this.heightOfAppHeader ?? 64) -
        this.mainViewPadding * 2 -
        (this.$refs.refToolBar?.clientHeight ?? 56)
      );
    },
  },

  beforeCreate() {},

  async created() {
    const me = this;
    me.initConfig();
  },
  mounted() {
    const me = this;
    window._list = me;
  },
  watch: {
    activeBuildingId(newValue, oldValue) {
      const me = this;
      if (!newValue || newValue === oldValue || !me.lastPagingParam?.itemsPerPage) {
        return;
      }

      if (Object.prototype.hasOwnProperty.call(me.store?.$state ?? {}, "building_id")) {
        me.store.$state.building_id = newValue;
      }

      if (Object.prototype.hasOwnProperty.call(me.store?.$state ?? {}, "invalidCache")) {
        me.store.$state.invalidCache = true;
      }

      me.loading = true;
      me.loadItems({ ...me.lastPagingParam, page: 1 });
    },
  },
  methods: {
    /**
     * @description Khởi tạo cấu hình cho list
     */
    initConfig() {},

    getDateItem(item, dateFields) {
      if (!Array.isArray(dateFields) || dateFields.length === 0) {
        return item;
      }

      dateFields.forEach((field) => {
        const col = `displayed_${field}`;
        item[col] = moment(item[field]).format("DD/MM/YYYY");
      });
      return item;
    },

    getNumberItem(item, numberFields) {
      numberFields.forEach((y) => {
        item[y] = formatNumberWithCommas(item[y]);
      });
      return item;
    },

    getEnumItem(item, enumFields) {
      enumFields.forEach((x) => {
        const keys = Object.keys(_enum[x.enum]);
        const key = keys.find((y) => _enum[x.enum][y] == item[x.field]);
        if (key) {
          const col = `displayed_${x.field}`;
          item[col] = key;
        }
      });
      return item;
    },

    viewDetail() {
      const me = this;
      if (!me.detailForm) {
        throw new Error("detailForm is required");
      }
      const param = {
        mode: me._enum.Mode.Add,
        detailForm: me.detailForm,
        refresh: this.refresh,
      };
      popupUtil.show(me.detailForm, param);
    },

    handleOnEditGrid({ row }) {
      const me = this;
      if (!me.detailForm) {
        throw new Error("detailForm is required");
      }
      const param = {
        mode: me._enum.Mode.View,
        detailData: row,
        detailForm: me.detailForm,
      };
      me.$vfm.show({ component: me.detailForm }, param).then(() => {
        // do something on modal opened
        console.log(me.detailForm);
      });
    },

    async deleteItem(item) {
      const me = this;
      try {
        me.loading = true;
        await me.store.deleteAsync(item[me.idField]);
        showMessage("Xóa thành công!");
      } catch (error) {
        console.error(error);
      } finally {
        me.loading = false;
      }
    },

    async loadItems({ page = 1, itemsPerPage = this.itemsPerPage, sortBy = [] } = {}) {
      const me = this;

      me.lastPagingParam = { page, itemsPerPage, sortBy };
      me.loading = true;

      var sorts = me.defaultSorts;
      if (sortBy.length) {
        sorts = sortBy.map((x) => ({
          Column: x.key,
          IsAscending: x.order === "asc" ? true : false,
        }));
      }

      const payload = {
        skip: page - 1,
        take: itemsPerPage,
        searchItem: {
          columns: me.keyWord ? me.searchFields : [],
          value: me.keyWord,
        },
        sorts,
      };

      if (Array.isArray(me.defaultFilters)) {
        payload.filters = me.defaultFilters;
      }

      try {
        await me.store.getPaging(payload);
      } catch (error) {
        console.error(error);
      } finally {
        me.loading = false;
      }
    },

    async refresh() {
      const me = this;
      if (Object.prototype.hasOwnProperty.call(me.store?.$state ?? {}, "invalidCache")) {
        me.store.$state.invalidCache = true;
      }

      const pagingParam = me.lastPagingParam?.itemsPerPage
        ? me.lastPagingParam
        : { page: 1, itemsPerPage: me.itemsPerPage, sortBy: [] };

      await me.loadItems(pagingParam);
    },

    onSearch(searchText) {
      const me = this;
      me.keyWord = searchText;
    },

    editItem(item) {
      const me = this;
      popupUtil.show(me.detailForm, {
        editMode: _enum.Mode.Update,
        model: cloneDeep(item),
        refresh: me.refresh,
      });
    },
  },
};
