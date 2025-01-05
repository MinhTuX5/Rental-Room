import { createVuetify } from "vuetify";
// Import các style cần thiết
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // Import MDI icons
// components
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
// date
import DateFnsAdapter from "@date-io/date-fns";
import enUS from "date-fns/locale/en-US";
import svSE from "date-fns/locale/sv";
import vi from "date-fns/locale/vi";
// import zhCn from "date-fns/locale/zh-cn";

// Cấu hình Vuetify
const vuetify = createVuetify({
  // Thêm cấu hình tùy chỉnh tại đây
  components,
  directives,
  locale: {
    locale: 'vi',
  },
  date: {
    adapter: DateFnsAdapter,
    locale: {
      vi: vi,
      sv: svSE,
      en: enUS
    },
  },
});

export default vuetify;
