// Enum
import _enum from "@/common/enum";

export default {
  name: "Base",
  props: {},
  data() {
    return { _enum };
  },
  mounted() {
    const me = this;

    // log ra tên component được mở
    console.log(me.$.type.name);

    window._view = me;
  },
};
