import { createVuetify } from "vuetify";
// Import các style cần thiết
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css"; // Import MDI icons
// components
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Cấu hình Vuetify
const vuetify = createVuetify({
  // Thêm cấu hình tùy chỉnh tại đây
  components,
  directives,
});

export default vuetify;
