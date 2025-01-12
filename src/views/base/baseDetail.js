// enum
import _enum from "@/common/enum";
// base
import baseView from "./baseView";
// resource
import { showMessage } from "@/common/commonFunction";
import { convertCurrencyFormat } from "@/common/commonFunction";
import popupUtil from "../../common/popupUtil";

export default {
  name: "BaseDetail",
  extends: baseView,
  props: {},
  data() {
    return {
      title: "",
      model: {},
      defaultModel: {},
      editMode: _enum.Mode.Add,
      _enum,
      store: {},
      loading: false,
      updateText: "Sửa",
      addText: "Thêm",
    };
  },
  computed: {
    viewing() {
      return this.editMode == _enum.Mode.View;
    },
    numberFields() {
      return this.store.$state.numberFields ?? [];
    },
    detailForm() {
      return this.$.type.name ?? "";
    },
  },
  created() {
    const me = this;
    me.initConfig();
  },
  mounted() {
    window._detail = this;
  },
  methods: {
    /**
     * @description Khởi tạo cấu hình
     */
    initConfig() {},

    /**
     * Thực hiện trước khi mở modal
     * @param {Object} e event
     */
    beforeOpen($event) {
      const me = this;

      me._formParam = $event.ref.params?.value;
      // Cập nhật edit mode
      me.editMode = me._formParam.editMode ?? _enum.Mode.Add;

      if (
        me._formParam.model &&
        typeof me._formParam.model === "object" &&
        Array.isArray(me.numberFields)
      ) {
        me.numberFields.forEach((x) => {
          me._formParam.model[x] = convertCurrencyFormat(
            me._formParam.model[x]
          );
        });
      }

      // Lấy giá trị mặc định
      const keys = Object.keys(me.defaultModel);
      if (keys.length > 0) {
        me.model = { ...me.defaultModel };
      }

      // Không phải thêm mới
      if (me.editMode != _enum.Mode.Add) {
        const currentModel = me._formParam.model;
        if (currentModel && typeof currentModel == "object") {
          me.model = { ...me.model, ...currentModel };
        }
      }
    },

    /**
     * Xử lý sau khi đã mở modal
     */
    opened() {
      const me = this;
      me.updateTitle(me.editMode);
    },

    /**
     * Cập nhật title theo Mode
     * @param {Number} mode Mode của màn detail
     */
    updateTitle(mode) {
      const me = this;
      const title = me.title.toLowerCase();
      switch (mode) {
        case _enum.Mode.Add:
          me.title = me.addText + me.addText ? " " : "" + title;
          break;
        case _enum.Mode.Update:
          me.title = me.updateText + me.updateText ? " " : "" + title;
          break;
        default:
          break;
      }
    },

    beforeSubmit() {
      const me = this;
      me.handleCommon();
      me.customBeforeSubmit();
    },

    handleCommon() {
      const me = this;
      if (me.store?.$state?.buildingID) {
        me.model.building_id = me.store.$state.buildingID;
      }
    },
    customBeforeSubmit() {},

    async submit() {
      const me = this;
      me.loading = true;
      // handle before save
      me.beforeSubmit();
      // call API
      try {
        switch (me.editMode) {
          case _enum.Mode.Update:
            await me.update();
            break;
          default:
            await me.insert();
            break;
        }
      } catch (error) {
        console.error(error);
      } finally {
        me.loading = false;
      }
    },

    async insert() {
      const me = this;
      try {
        const item = await me.store.insertAsync(me.model);
        showMessage("Thêm mới thành công");
        me.submitSuccess(item);
      } catch (error) {
        console.log(error);
      }
    },

    async update() {
      const me = this;
      try {
        const res = await me.store.putAsync(me.model);
        // Show result
        if (res) {
          // show toast
          showMessage("Cập nhật thành công");
          // Xử lý sau khi lưu thành công
          if (res) {
            me.submitSuccess(res);
          }
        }
      } catch (error) {
        console.error(error);
      }
    },

    hide() {
      const me = this;
      const detailForm = me.detailForm ?? me._formParam?.detailForm;
      if (detailForm) {
        me.$vfm.hide(detailForm);
      }
    },

    submitSuccess(data) {
      const me = this;
      const callBack = me._formParam.options?.afterSubmit;
      if (callBack && typeof callBack == "function") {
        callBack(data);
      }

      me.hide();
    },

    viewForm(formName, param = {}) {
      if (!formName) {
        throw new Error("formName is required");
      }
      popupUtil.show(formName, param);
    },
  },
};
