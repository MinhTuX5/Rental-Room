export default {
  name: "Base",
  props: {},
  data() {
    return {};
  },
  mounted() {
    const me = this;
    
    // log ra tên component được mở
    console.log(me.$.type.name);

    window._view = me;
  },
};
