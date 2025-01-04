import { cloneDeep } from "lodash";
import moment from "moment";
// base
import baseList from "./baseList";
// resources
import popupUtil from "../../common/popupUtil";
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
      const data = this.store?.$state.items ?? [];
      data.forEach((item) => {
        item = me.getDateItem(item, me.store?.$state.dateFields);
      });
      return data;
    },
    totalItems() {
      return this.store.$state.totalItems ?? 0;
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
        item[col] = moment(item[field]).format("DD-MM-YYYY");
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

    async loadItems({ page, itemsPerPage, sortBy }) {
      const me = this;

      me.lastPagingParam = { page, itemsPerPage, sortBy };

      var sorts = me.defaultSorts.map((x) => ({
        Column: x.Field,
        IsAscending: x.IsAscending,
      }));
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
        filters: me.defaultFilters,
      };
      try {
        await me.store.getPaging(payload);
      } catch (error) {
        console.error(error);
      } finally {
        me.loading = false;
      }
    },

    refresh() {
      const me = this;
      me.loadItems(me.lastPagingParam);
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
      });
    },
  },
};
