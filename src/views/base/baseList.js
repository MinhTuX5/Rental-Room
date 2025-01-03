// Enum
import _enum from "@/common/enum";
// base
import baseView from "./baseView";

export default {
  name: "BaseList",
  extends: baseView,
  props: {},
  data() {
    return {
      detailForm: "",
      store: {},
      loading: true,
      search: "",
    };
  },
  computed: {
    idField() {
      return this.store?.$state.idField;
    },
  },

  beforeCreate() {},

  async created() {
    const me = this;
    me.initConfig();
  },
  methods: {
    /**
     * @description Khởi tạo cấu hình cho list
     */
    initConfig() {},

    async getTableData() {
      const me = this;
      // Lấy dữ liệu danh sách
      if (typeof me.store?.dispatch == "function") {
        await me.store.dispatch("getAll");
      }
    },

    handleOnEditGrid({ row }) {
      const me = this;
      if (!me.detailForm) {
        throw new Error("detailForm is required");
      }
      const param = {
        mode: _enum.Mode.View,
        detailData: row,
        detailForm: me.detailForm,
      };
      me.$vfm.show({ component: me.detailForm }, param).then(() => {
        // do something on modal opened
        console.log(me.detailForm);
      });
    },

    handleOnDeleteGrid({ row }) {
      const me = this;

      // ElMessageBox.alert("Bạn có thực sự muốn xóa bản ghi này?", "Xác nhận", {
      //   // if you want to disable its autofocus
      //   // autofocus: false,
      //   confirmButtonText: "Đồng ý",
      //   showCancelButton: true,
      //   cancelButtonText: "Hoãn",
      //   draggable: true,
      //   callback: async (action) => {
      //     if (action == _enum.Action.Confirm) {
      //       if (me.idField) {
      //         try {
      //           // CALL API
      //           const res = await me.store.state.api.deleteAsync(
      //             row[me.idField]
      //           );
      //           // Show result
      //           if (
      //             res?.status == _enum.APIStatus.Ok &&
      //             res?.data?.code == _enum.APICode.Success
      //           ) {
      //             // update store
      //             me.store.commit("delete", res.data.entity);
      //             // show toast
      //             ElMessage({
      //               message: "Xóa thành công",
      //               type: "success",
      //             });
      //           } else {
      //             if (res?.data?.code == _enum.APICode.Fail) {
      //               ElMessage.error(res.data.message);
      //             }
      //             ElMessage.error("Có lỗi xảy ra!");
      //           }
      //         } catch (error) {
      //           console.log(error);
      //           ElMessage.error("Có lỗi xảy ra!");
      //         }
      //       }
      //     }
      //   },
      // });
    },
  },
};
