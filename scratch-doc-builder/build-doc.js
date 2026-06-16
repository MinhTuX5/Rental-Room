const docx = require("docx");
const fs = require("fs");
const path = require("path");

const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    HeadingLevel,
    Table,
    TableRow,
    TableCell,
    WidthType,
    BorderStyle,
    AlignmentType
} = docx;

// Cấu hình chung cho style
const FONT_PRIMARY = "Calibri";
const FONT_CODE = "Courier New";

const COLOR_PRIMARY = "003366";   // Xanh dương đậm cho Heading 1
const COLOR_SECONDARY = "008080"; // Teal cho Heading 2
const COLOR_TEXT = "333333";      // Xám đậm cho Body Text
const COLOR_BG_CODE = "F5F5F5";   // Xám nhạt cho nền code block
const COLOR_BORDER_CODE = "0078D4"; // Xanh dương cho viền trái code block

// Helper tạo Heading 1
function createHeading1(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
        keepWithNext: true,
    });
}

// Helper tạo Heading 2
function createHeading2(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 180, after: 80 },
        keepWithNext: true,
    });
}

// Helper tạo Heading 3
function createHeading3(text) {
    return new Paragraph({
        text: text,
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 120, after: 60 },
        keepWithNext: true,
    });
}

// Helper tạo đoạn văn thường
function createParagraph(text, options = {}) {
    return new Paragraph({
        children: [
            new TextRun({
                text: text,
                size: options.size || 24, // 12pt
                font: FONT_PRIMARY,
                bold: options.bold || false,
                italic: options.italic || false,
                color: options.color || COLOR_TEXT,
            })
        ],
        spacing: { before: 60, after: 60, line: 276 }, // Spacing 1.15
    });
}

// Helper tạo danh sách bullet point
function createBullet(text, options = {}) {
    return new Paragraph({
        children: [
            new TextRun({
                text: "•  ",
                font: FONT_PRIMARY,
                bold: true,
                size: 24,
                color: COLOR_SECONDARY
            }),
            new TextRun({
                text: text,
                font: FONT_PRIMARY,
                size: 24,
                bold: options.bold || false,
                italic: options.italic || false,
                color: COLOR_TEXT
            })
        ],
        spacing: { before: 40, after: 40, line: 276 },
        indent: { left: 360 }
    });
}

// Helper tạo danh sách số thứ tự
function createNumbered(num, text, options = {}) {
    return new Paragraph({
        children: [
            new TextRun({
                text: `${num}. `,
                font: FONT_PRIMARY,
                bold: true,
                size: 24,
                color: COLOR_PRIMARY
            }),
            new TextRun({
                text: text,
                font: FONT_PRIMARY,
                size: 24,
                bold: options.bold || false,
                italic: options.italic || false,
                color: COLOR_TEXT
            })
        ],
        spacing: { before: 40, after: 40, line: 276 },
        indent: { left: 360 }
    });
}

// Helper tạo code block đẹp mắt giống như IDE
function createCodeBlock(codeLines) {
    return new Table({
        width: {
            size: 100,
            type: WidthType.PERCENTAGE,
        },
        rows: [
            new TableRow({
                children: [
                    new TableCell({
                        children: codeLines.map(line => new Paragraph({
                            children: [
                                new TextRun({
                                    text: line,
                                    font: FONT_CODE,
                                    size: 19, // ~9.5pt
                                    color: "222222"
                                })
                            ],
                            spacing: {
                                before: 30,
                                after: 30,
                            }
                        })),
                        shading: {
                            fill: COLOR_BG_CODE,
                        },
                        margins: {
                            top: 100,
                            bottom: 100,
                            left: 150,
                            right: 150,
                        },
                        borders: {
                            top: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
                            bottom: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
                            left: { style: BorderStyle.SINGLE, size: 16, color: COLOR_BORDER_CODE }, // Cạnh trái viền xanh dày
                            right: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
                        }
                    })
                ]
            })
        ]
    });
}

const docChildren = [];

// ================== TRANG TIÊU ĐỀ ==================
docChildren.push(
    new Paragraph({
        children: [
            new TextRun({
                text: "BÁO CÁO PHÂN TÍCH CHI TIẾT MÃ NGUỒN",
                bold: true,
                size: 36, // 18pt
                font: FONT_PRIMARY,
                color: COLOR_PRIMARY
            })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 1000, after: 200 }
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: "CHỨC NĂNG: ĐĂNG NHẬP, ĐĂNG KÝ & QUÊN MẬT KHẨU",
                bold: true,
                size: 28, // 14pt
                font: FONT_PRIMARY,
                color: COLOR_SECONDARY
            })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 1000 }
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: "Dự án: Hệ thống quản lý phòng trọ (Rent Room Management)",
                italic: true,
                size: 24,
                font: FONT_PRIMARY
            })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
    }),
    new Paragraph({
        children: [
            new TextRun({
                text: "Người thực hiện: Chuyên gia Phân tích Mã nguồn & Kỹ sư Phần mềm Cao cấp",
                bold: true,
                size: 24,
                font: FONT_PRIMARY
            })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 2000 }
    })
);

// ================== PHẦN 1: KIẾN TRÚC TỔNG QUAN ==================
docChildren.push(
    createHeading1("Phần 1: Kiến Trúc Tổng Quan và Luồng Đi Của Dữ Liệu"),
    createParagraph("Trong hệ thống quản lý phòng trọ này, các chức năng Đăng nhập, Đăng ký và Quên mật khẩu được thiết kế theo mô hình Client-Server phân lớp rõ ràng. Frontend được phát triển bằng framework Vue.js (kết hợp thư viện Vuetify và quản lý trạng thái Pinia). Backend được xây dựng bằng công nghệ ASP.NET Core Web API theo kiến trúc 3 lớp (API -> Business Logic Layer - BL -> Data Access Layer - DL) kết hợp với tầng dùng chung (Common). Dữ liệu được lưu trữ trong cơ sở dữ liệu MySQL, được truy vấn hiệu năng cao thông qua ORM siêu nhẹ Dapper."),
    
    createHeading2("1. Luồng đi của dữ liệu (Data Flow)"),
    createNumbered(1, "Chức năng Đăng nhập (Login):"),
    createBullet("Người dùng nhập số điện thoại (tài khoản), mật khẩu và chọn vai trò của mình trên giao diện (TLoginPopup.vue)."),
    createBullet("Dữ liệu được đóng gói vào payload dạng LoginParam rồi gửi thông qua HTTP POST (qua Axios ở userAPI/index.js) tới API endpoint /api/v1/auth/login ở phía Backend."),
    createBullet("Tại Backend, AuthController tiếp nhận request và chuyển tiếp tham số cho AuthBL để thực hiện kiểm tra sơ bộ."),
    createBullet("AuthBL gọi AuthDL thực hiện truy vấn cơ sở dữ liệu. AuthDL băm mật khẩu người dùng gửi lên bằng thuật toán SHA-256 rồi so sánh với password_hash được lưu trữ trong bảng users."),
    createBullet("Nếu thông tin trùng khớp, Backend trả về mã JWT (Json Web Token) chứa thông tin vai trò (role) và đối tượng người dùng."),
    createBullet("Frontend nhận phản hồi, giải mã và lưu trữ thông tin context người dùng vào localStorage tương ứng với vai trò (chủ trọ dùng 'context_management', quản trị viên dùng 'context_admin', khách tìm trọ dùng 'context') để phân quyền truy cập chức năng và điều hướng sang trang tương ứng."),

    createNumbered(2, "Chức năng Đăng ký (Register):"),
    createBullet("Người dùng nhập Email, Họ tên, Số điện thoại, Vai trò và Mật khẩu trên giao diện Register.vue."),
    createBullet("Logic Javascript trong file register.js tiến hành validate các thông tin (độ dài, định dạng email, bắt buộc nhập) bằng thư viện Vuelidate."),
    createBullet("Sau khi validate thành công, dữ liệu được gửi qua API Auth/Register tới Controller phía BE."),
    createBullet("Backend kiểm tra tính duy nhất của Email và Số điện thoại trong bảng users. Nếu chưa tồn tại, mật khẩu được băm SHA-256 và lưu thông tin người dùng vào bảng users, đồng thời phân vai trò vào bảng user_roles trong cùng một Transaction để đảm bảo tính toàn vẹn dữ liệu."),

    createNumbered(3, "Chức năng Quên mật khẩu (Forgot Password):"),
    createBullet("Để tối giản hóa và kiểm thử giao diện nhanh chóng, chức năng Quên mật khẩu hiện đang được giả lập (Mock) hoàn toàn ở phía Frontend."),
    createBullet("Người dùng nhập Số điện thoại tài khoản rồi bấm 'Lấy OTP'. Giao diện sinh ra mã OTP ngẫu nhiên từ 1000 đến 9999, hiển thị trực tiếp dưới dạng thông báo (showMessage)."),
    createBullet("Khi người dùng nhập đúng mã OTP vừa được hiển thị và bấm 'Xác nhận', hệ thống Frontend tự động tìm kiếm thông tin và trả về mật khẩu mặc định là '12345678' mà không cần gọi truy vấn lên Backend."),

    createHeading2("2. Thuật toán và công nghệ bảo mật chính sử dụng"),
    createBullet("Mã hóa mật khẩu: Sử dụng thuật toán SHA-256 một chiều để băm mật khẩu (hàm CalculateSHA256Hash trong AuthDL.cs) trước khi so sánh hoặc lưu vào database. Thuật toán này đảm bảo mật khẩu người dùng không bao giờ bị lưu dưới dạng văn bản rõ (plain text)."),
    createBullet("Xác thực hệ thống: Sử dụng mã JWT (JSON Web Token) để quản lý phiên làm việc của người dùng. Token chứa Claim về User ID, vai trò (role) và được ký bằng thuật toán HmacSha256 với khóa bảo mật đặt cấu hình ở file appsettings.json. Thời gian hết hạn của token được thiết lập là 120 phút.")
);

// ================== PHẦN 2: PHÂN TÍCH CHI TIẾT FRONTEND ==================
docChildren.push(
    createHeading1("Phần 2: Phân Tích Chi Tiết Từng File Phía Frontend (FE)"),
    createParagraph("Dưới đây là phân tích chi tiết của 7 file mã nguồn thuộc dự án Frontend (Rental-Room):")
);

// 2.1 Login.vue
docChildren.push(
    createHeading2("2.1 File Login.vue"),
    createParagraph("Đường dẫn: src/views/auth/login/Login.vue"),
    createParagraph("Mục đích: File này đóng vai trò là một view page bọc bên ngoài cho trang đăng nhập, chịu trách nhiệm căn chỉnh giao diện chính, thiết lập hình nền nền và gọi component con TLoginPopup để người dùng thao tác."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "<template>",
        "  <v-img",
        "    cover",
        "    src=\"https://picsum.photos/1920/1080?random\"",
        "    class=\"login-page h-screen d-flex justify-center align-center\"",
        "  >",
        "    <template #placeholder> </template>",
        "    <TLoginPopup :isManagementPage=\"true\" />",
        "  </v-img>",
        "</template>",
        "",
        "<script>",
        "import TLoginPopup from \"@/components/views/loginPopup/TLoginPopup.vue\";",
        "",
        "export default {",
        "  name: \"LoginView\",",
        "  components: { TLoginPopup },",
        "  setup() {},",
        "};",
        "</script>"
    ]),
    createParagraph("Giải thích các thành phần quan trọng trong file:"),
    createBullet("<v-img cover ...>: Sử dụng component hiển thị ảnh của thư viện Vuetify làm hình nền phủ kín màn hình (h-screen) và căn giữa nội dung biểu mẫu đăng nhập bằng class CSS Flexbox (d-flex justify-center align-center)."),
    createBullet("<TLoginPopup :isManagementPage=\"true\" />: Nhúng component form đăng nhập TLoginPopup vào giữa trang và truyền prop isManagementPage = true để thiết lập chế độ hiển thị phù hợp cho trang quản lý.")
);

// 2.2 TLoginPopup.vue
docChildren.push(
    createHeading2("2.2 Component TLoginPopup.vue"),
    createParagraph("Đường dẫn: src/components/views/loginPopup/TLoginPopup.vue"),
    createParagraph("Mục đích: Component chứa toàn bộ giao diện của Form đăng nhập và xử lý luồng đăng nhập chính bao gồm đăng nhập hệ thống thông thường và đăng nhập qua dịch vụ bên thứ ba (Google, Facebook OAuth từ thư viện Firebase)."),
    createParagraph("Mã nguồn xử lý logic chính (Phần Script):"),
    createCodeBlock([
        "const login = async () => {",
        "  const me = proxy;",
        "  try {",
        "    const payload = { ...me.model };",
        "    overlay.value = true; // Bật màn hình chờ loading",
        "    const rs = await api.login(payload); // Gọi API đăng nhập ở BE",
        "    handleAfterLogin(rs); // Xử lý lưu token và phân quyền sau khi đăng nhập",
        "  } catch (error) {",
        "    if (error.status === 400) {",
        "      showMessage(\"Tài khoản, mật khẩu hoặc vai trò không hợp lệ!\", MessageType.Warning);",
        "    } else {",
        "      showMessage(\"Đã có lỗi xảy ra!\", MessageType.Error);",
        "    }",
        "  } finally {",
        "    overlay.value = false; // Tắt loading",
        "  }",
        "};"
    ]),
    createParagraph("Giải thích chi tiết khối lệnh login:"),
    createBullet("Dòng 4: Khởi tạo payload chứa các trường account (số điện thoại), password (mật khẩu) và role (vai trò đăng nhập) từ model reactive."),
    createBullet("Dòng 6: Gọi hàm asynchronous api.login(payload) gửi dữ liệu POST đến backend. Hàm này được định nghĩa trong userAPI/index.js."),
    createBullet("Dòng 7: Gọi hàm handleAfterLogin để xử lý kết quả trả về từ Backend. Dưới đây là phân tích luồng lưu trữ context của hàm này:"),
    createCodeBlock([
        "const handleAfterLogin = (rs) => {",
        "  const me = proxy;",
        "  if (rs.data && typeof rs.data === \"object\") {",
        "    const context = { ...rs.data };",
        "    let store = {};",
        "    let localStorageKey = \"\";",
        "    // Xác định bộ lưu trữ (store) và key localStorage dựa theo vai trò người dùng",
        "    if (context.role == Role.Admin) {",
        "      localStorageKey = \"context_admin\";",
        "      store = useContextAdminStore();",
        "    } else if (context.role == Role.Renter || context.role == Role.Innkeeper) {",
        "      localStorageKey = \"context_management\";",
        "      store = useContextManageStore();",
        "    } else {",
        "      localStorageKey = \"context\";",
        "      store = useContextStore();",
        "    }",
        "    window.PageRole = context.role; // Đặt biến toàn cục cho vai trò",
        "    store.$state = { ...store.$state, ...context }; // Gán state vào Pinia store",
        "    localStorage.setItem(localStorageKey, JSON.stringify(context)); // Lưu vào trình duyệt",
        "    showMessage(\"Đăng nhập thành công!\");",
        "    // Điều hướng trang thích hợp",
        "    if (context.role == Role.Admin) { openAdminPage(); }",
        "    else if (context.role == Role.Renter || context.role == Role.Innkeeper) {",
        "      me.$router.push({ name: \"Management\" });",
        "    } else {",
        "      me.$router.push({ name: \"RoomSearchView\" });",
        "    }",
        "  }",
        "};"
    ]),
    createParagraph("Giải thích logic phân phối quyền lưu trữ (handleAfterLogin):"),
    createBullet("Hệ thống chia làm 3 loại khóa lưu trữ localStorage khác nhau để tránh xung đột dữ liệu: 'context_admin' dành cho Admin, 'context_management' dành cho Người thuê/Chủ trọ và 'context' dành cho Khách tìm trọ bình thường."),
    createBullet("Sau khi cập nhật Pinia Store của Vue, trang web sử dụng router.push() để điều hướng người dùng tới phân hệ trang tương ứng (Admin thì mở trang quản lý admin ở tab mới; Renter/Innkeeper vào trang quản trị quản lý phòng trọ 'Management'; RoomSeeker về trang tìm kiếm phòng trọ 'RoomSearchView').")
);

// 2.3 Register.vue
docChildren.push(
    createHeading2("2.3 File Register.vue"),
    createParagraph("Đường dẫn: src/views/auth/register/Register.vue"),
    createParagraph("Mục đích: Định nghĩa cấu trúc giao diện HTML (sử dụng các thành phần Vuetify) cho Form đăng ký thành viên mới và liên kết các sự kiện tương tác dữ liệu với file xử lý logic js."),
    createParagraph("Mã nguồn cấu trúc form chính:"),
    createCodeBlock([
        "<v-text-field label=\"Email*\" type=\"email\" v-model=\"state.email\"",
        "  :error-messages=\"v$.email.$errors.map((e) => e.$message)\" @blur=\"v$.email.$touch\"></v-text-field>",
        "<v-text-field label=\"Họ và tên*\" v-model=\"state.fullName\"",
        "  :error-messages=\"v$.fullName.$errors.map((e) => e.$message)\" @blur=\"v$.fullName.$touch\"></v-text-field>",
        "<v-text-field label=\"Số điện thoại/tài khoản*\" v-model=\"state.account\"",
        "  :error-messages=\"v$.account.$errors.map((e) => e.$message)\" @blur=\"v$.account.$touch\"></v-text-field>",
        "<v-select v-model=\"state.role\" :items=\"registerRoles\" item-title=\"label\" item-value=\"value\" label=\"Vai trò*\"></v-select>",
        "<v-text-field label=\"Mật khẩu*\" v-model=\"state.password\" :type=\"showPassword ? 'text' : 'password'\"",
        "  :error-messages=\"v$.password.$errors.map((e) => e.$message)\" @blur=\"v$.password.$touch\"></v-text-field>"
    ]),
    createParagraph("Giải thích các thành phần giao diện đăng ký:"),
    createBullet("v-model: Thực hiện ràng buộc dữ liệu hai chiều (Two-way data binding) giữa các trường input nhập liệu với đối tượng reactive state được mô tả trong register.js."),
    createBullet(":error-messages=\"v$.email.$errors.map((e) => e.$message)\": Sử dụng thư viện Vuelidate để lấy danh sách thông báo lỗi kiểm thử định dạng và hiển thị trực tiếp dưới trường nhập liệu."),
    createBullet("@blur=\"v$.[fieldName].$touch\": Kích hoạt trạng thái kiểm tra lỗi (touch) khi người dùng di chuột hoặc chuyển tiêu điểm ra ngoài trường nhập liệu giúp tối ưu trải nghiệm người dùng.")
);

// 2.4 register.js
docChildren.push(
    createHeading2("2.4 File register.js"),
    createParagraph("Đường dẫn: src/views/auth/register/register.js"),
    createParagraph("Mục đích: Chứa logic validation dữ liệu đăng ký đầu vào và gọi API BE để tạo mới tài khoản."),
    createParagraph("Mã nguồn xử lý đăng ký chính:"),
    createCodeBlock([
        "export const useRegister = () => {",
        "  const loading = ref(false);",
        "  const errorMessage = ref(\"\");",
        "  const successMessage = ref(\"\");",
        "  const initialState = { account: \"\", password: \"\", email: \"\", fullName: \"\", role: Role.RoomSeeker };",
        "  const state = reactive({ ...initialState });",
        "",
        "  // Định nghĩa quy tắc Validate bằng Vuelidate",
        "  const rules = {",
        "    email: { email },",
        "    account: { required, maxLength: maxLength(11), minLength: minLength(10) },",
        "    password: { required, minLength: minLength(8) },",
        "    fullName: { required },",
        "    role: { required },",
        "  };",
        "",
        "  const v$ = useVuelidate(rules, state);",
        "",
        "  const register = async () => {",
        "    const isValid = await v$.value.$validate(); // Thực hiện validate toàn bộ form",
        "    if (!isValid) return;",
        "    loading.value = true;",
        "    try {",
        "      const payload = {",
        "        account: state.account, email: state.email, fullName: state.fullName,",
        "        phoneNumber: state.account, password: state.password, role: state.role",
        "      };",
        "      await userAPI.register(payload); // Gọi API đăng ký của Backend",
        "      Object.assign(state, initialState); // Reset toàn bộ form đăng ký về ban đầu",
        "      v$.value.$reset();",
        "      successMessage.value = \"Đăng ký thành công.\";",
        "    } catch (error) {",
        "      errorMessage.value = error?.response?.data?.message || \"Đăng ký thất bại. Vui lòng thử lại.\";",
        "    } finally {",
        "      loading.value = false;",
        "    }",
        "  };",
        "  // ..."
    ]),
    createParagraph("Giải thích các xử lý quan trọng:"),
    createBullet("rules (dòng 9-15): Định nghĩa các quy tắc kiểm thử đầu vào. Email phải đúng định dạng email; Tài khoản (account) phải là số điện thoại có độ dài tối thiểu 10 ký tự và tối đa 11 ký tự; Mật khẩu phải có độ dài tối thiểu 8 ký tự."),
    createBullet("v$.value.$validate() (dòng 20): Trả về true nếu tất cả các quy tắc trong rules được đáp ứng đầy đủ."),
    createBullet("Object.assign(state, initialState) (dòng 29): Xóa sạch dữ liệu đã nhập trên form đăng ký sau khi BE trả về kết quả đăng ký thành công, chuẩn bị cho lượt nhập tiếp theo.")
);

// 2.5 ForgotPassword.vue
docChildren.push(
    createHeading2("2.5 File ForgotPassword.vue"),
    createParagraph("Đường dẫn: src/views/auth/forgotPassword/ForgotPassword.vue"),
    createParagraph("Mục đích: Cung cấp giao diện phục vụ chức năng khôi phục lại mật khẩu thông qua kiểm tra số điện thoại (tài khoản) và nhập mã xác thực OTP."),
    createParagraph("Mã nguồn cấu trúc form chính:"),
    createCodeBlock([
        "<v-text-field label=\"Tài khoản*\" v-model=\"model.account\" :min-width=\"400\"",
        "  :error-messages=\"v$.account.$errors.map((e) => e.$message)\" @blur=\"v$.account.$touch\"></v-text-field>",
        "<v-text-field label=\"OTP*\" v-model=\"model.otp\" density=\"compact\" maxlength=\"4\"",
        "  :error-messages=\"v$.otp.$errors.map((e) => e.$message)\" @blur=\"v$.otp.$touch\"></v-text-field>",
        "<div class=\"d-flex justify-center ga-3 mt-4\">",
        "  <v-btn type=\"button\" text=\"Lấy OTP\" color=\"green-lighten-1\" :loading=\"loading\" @click=\"requestOtp\" />",
        "  <v-btn type=\"button\" text=\"Xác nhận OTP\" color=\"blue-lighten-1\" :disabled=\"!generatedOtp\" @click=\"verifyOtp\" />",
        "</div>"
    ]),
    createParagraph("Giải thích hoạt động của giao diện:"),
    createBullet("Nút 'Lấy OTP': Kích hoạt sự kiện click gọi hàm requestOtp để bắt đầu tạo mã OTP giả lập."),
    createBullet("Nút 'Xác nhận OTP': Bị vô hiệu hóa (:disabled=\"!generatedOtp\") cho đến khi mã OTP giả lập được sinh ra thành công, giúp ngăn ngừa người dùng nhấn xác nhận rác.")
);

// 2.6 forgotPassword.js
docChildren.push(
    createHeading2("2.6 File forgotPassword.js"),
    createParagraph("Đường dẫn: src/views/auth/forgotPassword/forgotPassword.js"),
    createParagraph("Mục đích: Xử lý logic giả lập mã xác thực OTP và trả về mật khẩu tương ứng của người dùng."),
    createParagraph("Mã nguồn xử lý logic chính:"),
    createCodeBlock([
        "export const useForgotPassword = () => {",
        "  const generatedOtp = ref(\"\");",
        "  const selectedUser = ref(null);",
        "  const model = ref({ account: \"\", otp: \"\" });",
        "  const rules = { account: { required }, otp: { required, minLength: minLength(4) } };",
        "  const v$ = useVuelidate(rules, model);",
        "",
        "  const generateOtp = () => {",
        "    // Sinh mã ngẫu nhiên có 4 chữ số từ 1000 đến 9999",
        "    return Math.floor(1000 + Math.random() * 9000).toString();",
        "  };",
        "",
        "  const requestOtp = async () => {",
        "    v$.value.account.$touch();",
        "    if (v$.value.account.$invalid) return;",
        "    loading.value = true;",
        "    try {",
        "      // Kiểm tra định dạng số điện thoại tài khoản (10-11 số)",
        "      if (!/^\\d{10,11}$/.test(String(model.value.account ?? \"\").trim())) {",
        "        showMessage(\"Tài khoản không hợp lệ!\", MessageType.Warning);",
        "        return;",
        "      }",
        "      selectedUser.value = { account: model.value.account, password: \"12345678\" };",
        "      generatedOtp.value = generateOtp(); // Sinh OTP",
        "      showMessage(`Mã OTP của bạn là: ${generatedOtp.value}`); // Hiển thị OTP giả lập",
        "    } finally { loading.value = false; }",
        "  };",
        "",
        "  const verifyOtp = () => {",
        "    v$.value.otp.$touch();",
        "    if (v$.value.otp.$invalid) return;",
        "    if (model.value.otp !== generatedOtp.value) {",
        "      showMessage(\"Mã OTP không đúng!\", MessageType.Warning);",
        "      return;",
        "    }",
        "    // Hiển thị mật khẩu cho người dùng khi OTP khớp",
        "    showMessage(`Mật khẩu của bạn là: ${selectedUser.value.password}`);",
        "  };",
        "  // ..."
    ]),
    createParagraph("Giải thích thuật toán giả lập:"),
    createBullet("Hàm generateOtp (dòng 8-11): Sử dụng thuật toán toán học Math.floor(1000 + Math.random() * 9000) để đảm bảo luôn trả về một chuỗi số ngẫu nhiên có đúng 4 chữ số."),
    createBullet("Hàm requestOtp (dòng 13-26): Thực hiện regex kiểm tra định dạng tài khoản có phải số điện thoại hợp lệ hay không. Nếu hợp lệ, gán thông tin user ảo có mật khẩu là '12345678' và hiển thị mã OTP vừa tạo ra bằng thông báo alert."),
    createBullet("Hàm verifyOtp (dòng 28-37): So sánh chuỗi OTP do người dùng nhập (model.value.otp) với mã được lưu trữ trong generatedOtp. Nếu trùng khớp, thông báo mật khẩu của người dùng ra màn hình.")
);

// 2.7 userAPI/index.js
docChildren.push(
    createHeading2("2.7 File userAPI/index.js"),
    createParagraph("Đường dẫn: src/apis/userAPI/index.js"),
    createParagraph("Mục đích: Lớp kết nối API, kế thừa lớp cơ sở BaseAPI để thực hiện các yêu cầu mạng Axios gửi dữ liệu đăng nhập, đăng ký lên Backend Web API."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "import BaseAPI from \"@/apis/baseAPI\";",
        "const END_POINT = \"Auth/\";",
        "class UserAPI extends BaseAPI {",
        "  constructor() {",
        "    super(END_POINT); // Gọi constructor của lớp cha để gán prefix URL API",
        "  }",
        "  login(user) {",
        "    try {",
        "      return this.postAsync(user, \"login\"); // POST tới api/v1/Auth/login",
        "    } catch (error) { console.log(error); }",
        "  }",
        "  loginCallback(payload) {",
        "    try {",
        "      return this.postAsync(payload, \"login-callback\"); // POST tới api/v1/Auth/login-callback",
        "    } catch (error) { console.log(error); }",
        "  }",
        "  register(user) {",
        "    try {",
        "      return this.postAsync(user, \"Register\"); // POST tới api/v1/Auth/Register",
        "    } catch (error) { console.log(error); }",
        "  }",
        "}",
        "export default new UserAPI();"
    ]),
    createParagraph("Giải thích các thành phần:"),
    createBullet("super(END_POINT): Truyền endpoint 'Auth/' vào lớp cha BaseAPI. Từ đó, các phương thức postAsync sẽ tự động ghép nối thành đường dẫn đầy đủ dạng `http://<domain>/api/v1/Auth/login`."),
    createBullet("this.postAsync: Hàm bất đồng bộ đóng gói thư viện Axios để thực hiện request HTTP POST, tự động xử lý đính kèm Header cấu hình cần thiết.")
);

// ================== PHẦN 3: PHÂN TÍCH CHI TIẾT BACKEND ==================
docChildren.push(
    createHeading1("Phần 3: Phân Tích Chi Tiết Từng File Phía Backend (BE)"),
    createParagraph("Dưới đây là phân tích chi tiết của 7 file mã nguồn thuộc hệ thống Backend (Rent_Room_Management-BE):")
);

// 3.1 AuthController.cs
docChildren.push(
    createHeading2("3.1 File AuthController.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.API/Controllers/auth/AuthController.cs"),
    createParagraph("Mục đích: Lớp Controller chứa các HTTP Endpoint để đón tiếp các request đăng nhập, đăng ký từ phía client. Xử lý cấp phát token JWT bảo mật khi xác thực thông tin thành công."),
    createParagraph("Mã nguồn logic xử lý chính:"),
    createCodeBlock([
        "[HttpPost(\"login\")]",
        "public async Task<IActionResult> Login([FromBody] LoginParam login)",
        "{",
        "    // Gọi tầng BL để xác thực tài khoản và mật khẩu",
        "    var user = await _authBL.ValidateLogin(login);",
        "    if (user == null)",
        "    {",
        "        return BadRequest(); // Trả về mã lỗi 400 nếu sai tài khoản/mật khẩu",
        "    }",
        "    // Khởi tạo các Claims (Thông tin người dùng) để nhúng vào Token",
        "    var claims = new[]",
        "    {",
        "        new Claim(JwtRegisteredClaimNames.Sub, _configuration[\"Jwt:Subject\"]),",
        "        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),",
        "        new Claim(\"uid\", user.user_id.ToString()),",
        "        new Claim(\"r\", login.Role.ToString()),",
        "    };",
        "    // Tạo mã khóa ký Token từ cấu hình cấu hình hệ thống",
        "    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration[\"Jwt:Key\"]));",
        "    var signIn = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);",
        "    var expireAt = DateTime.UtcNow.AddMinutes(120); // Token hết hạn sau 2 tiếng",
        "    // Khởi tạo mã Token JWT",
        "    var token = new JwtSecurityToken(",
        "        _configuration[\"Jwt:Issuer\"],",
        "        _configuration[\"Jwt:Audience\"],",
        "        claims, expires: expireAt, signingCredentials: signIn);",
        "    string tokenVal = new JwtSecurityTokenHandler().WriteToken(token);",
        "    // Trả về mã token cùng thông tin cơ bản của user",
        "    return Ok(new { Token = tokenVal, User = user, ExpireAt = expireAt, Role = (int)login.Role });",
        "}"
    ]),
    createParagraph("Giải thích các thành phần và thư viện:"),
    createBullet("Claims (dòng 10-16): Các thông tin định danh dạng key-value được mã hóa bên trong JWT Token. Ở đây bao gồm JTI (ID duy nhất của Token), uid (ID người dùng) và r (Vai trò Role của người dùng để client phân quyền)."),
    createBullet("SymmetricSecurityKey (dòng 18): Khóa bảo mật đối xứng dùng để mã hóa chữ ký số của Token nhằm đảm bảo Token không bị thay đổi hoặc giả mạo."),
    createBullet("HmacSha256 (dòng 19): Thuật toán chữ ký số bảo mật dùng để ký và xác thực token JWT."),
    createBullet("JwtSecurityTokenHandler().WriteToken(token) (dòng 25): Chuyển đối tượng JWT thành chuỗi Base64 ký tự hoàn chỉnh gửi về Client.")
);

// 3.2 AuthBL.cs
docChildren.push(
    createHeading2("3.2 File AuthBL.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.BL/auth/AuthBL.cs"),
    createParagraph("Mục đích: Lớp Business Logic chứa các luật nghiệp vụ xử lý sơ bộ dữ liệu đăng nhập, đăng ký trước khi tương tác với DB."),
    createParagraph("Mã nguồn logic xử lý chính:"),
    createCodeBlock([
        "public async Task<UserDtoClient?> ValidateLogin(LoginParam param)",
        "{",
        "    // Nghiệp vụ kiểm tra tham số rỗng đầu vào",
        "    if (param == null || string.IsNullOrEmpty(param.Account) || string.IsNullOrEmpty(param.Password))",
        "    {",
        "        return default;",
        "    }",
        "    return await _authDL.ValidateLogin(param); // Chuyển yêu cầu xuống tầng DL",
        "}",
        "",
        "public async Task<(bool success, string message)> Register(RegisterParam param)",
        "{",
        "    // Kiểm tra tính hợp lệ của dữ liệu đăng ký bắt buộc",
        "    if (param == null ||",
        "        string.IsNullOrWhiteSpace(param.Account) ||",
        "        string.IsNullOrWhiteSpace(param.FullName) ||",
        "        string.IsNullOrWhiteSpace(param.PhoneNumber) ||",
        "        string.IsNullOrWhiteSpace(param.Password))",
        "    {",
        "        return (false, \"Vui lòng điền đầy đủ thông tin.\");",
        "    }",
        "    return await _authDL.Register(param); // Gọi tầng DL thực hiện ghi DB",
        "}"
    ]),
    createParagraph("Giải thích các kiểm tra nghiệp vụ:"),
    createBullet("Kiểm tra Null/Empty (dòng 4, 14-19): Giúp ngăn chặn các yêu cầu gửi dữ liệu thiếu lên cơ sở dữ liệu, tối ưu hóa băng thông mạng và tránh các lỗi crash hệ thống do NullReferenceException ở các tầng dưới.")
);

// 3.3 AuthDL.cs
docChildren.push(
    createHeading2("3.3 File AuthDL.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.DL/auth/AuthDL.cs"),
    createParagraph("Mục đích: Lớp Data Access chịu trách nhiệm kết nối trực tiếp với MySQL Database qua ConnectionString, thực thi câu lệnh SQL để xác thực người dùng và đăng ký người dùng mới."),
    createParagraph("Mã nguồn logic xử lý ValidateLogin & CalculateSHA256Hash:"),
    createCodeBlock([
        "public async Task<UserDtoClient?> ValidateLogin(LoginParam loginParam)",
        "{",
        "    using (var connection = new MySqlConnection(DatabaseContext.ConnectionString))",
        "    {",
        "        connection.Open();",
        "        // Thực hiện băm mật khẩu người dùng truyền lên",
        "        string hashedPassword = CalculateSHA256Hash(loginParam.Password);",
        "        var accountField = nameof(UserEntity.account);",
        "        // Câu lệnh SQL Join bảng users, user_roles và rhm_building để lấy thông tin chi tiết",
        "        string sql = $\"SELECT u.*, rb.{nameof(BuildingEntity.building_id)} FROM users u \" +",
        "            \"JOIN user_roles ur ON ur.user_id = u.user_id \" +",
        "            $\"LEFT JOIN rhm_building rb on u.user_id = rb.user_id AND rb.{nameof(BuildingEntity.status)} = {(int)BuildingStatus.Using} \" +",
        "            $\"WHERE u.{accountField} = @username AND u.password_hash = @password AND ur.role_id = @roleID\";",
        "",
        "        var param = new Dictionary<string, object>()",
        "        {",
        "            {\"username\", loginParam.Account ?? \"\" },",
        "            {\"password\", hashedPassword },",
        "            {\"roleID\", ((int)loginParam.Role).ToString() },",
        "        };",
        "        // Sử dụng Dapper thực thi truy vấn an toàn tránh lỗi SQL Injection",
        "        var result = await connection.QueryFirstOrDefaultAsync<UserDtoClient>(sql, param);",
        "        if (result != null)",
        "        {",
        "            result.password_hash = null; // Bảo mật: Không trả mã hash mật khẩu về client",
        "        }",
        "        return result;",
        "    }",
        "}",
        "",
        "public static string CalculateSHA256Hash(string input)",
        "{",
        "    using (SHA256 sha256 = SHA256.Create())",
        "    {",
        "        byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));",
        "        StringBuilder builder = new StringBuilder();",
        "        for (int i = 0; i < bytes.Length; i++)",
        "        {",
        "            builder.Append(bytes[i].ToString(\"x2\")); // Chuyển byte thành hệ lục phân (hex)",
        "        }",
        "        return builder.ToString();",
        "    }",
        "}"
    ]),
    createParagraph("Giải thích thuật toán và truy vấn cơ sở dữ liệu:"),
    createBullet("CalculateSHA256Hash (dòng 29-41): Thuật toán băm mật khẩu. Hàm chuyển đổi chuỗi mật khẩu thô (input) thành mảng các byte dữ liệu, sau đó sử dụng SHA-256 để tính toán mã băm cố định 256-bit và định dạng lại dưới dạng chuỗi hexa gồm 64 ký tự."),
    createBullet("Dapper QueryFirstOrDefaultAsync (dòng 21): Thực hiện truy vấn dữ liệu bất đồng bộ. Sử dụng đối tượng param chứa các tham số @username, @password để Dapper tự động thực hiện Parameterized Query, ngăn ngừa triệt để lỗi lỗ hổng bảo mật SQL Injection."),
    createBullet("Bảo mật mật khẩu (dòng 24): Ngay sau khi tìm thấy thông tin khớp, chương trình gán password_hash = null để đảm bảo mã băm bảo mật không bị lộ lọt qua luồng HTTP Response.")
);

// 3.4 LoginParam.cs
docChildren.push(
    createHeading2("3.4 File LoginParam.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.Common/Param/LoginParam.cs"),
    createParagraph("Mục đích: Lớp đối tượng Parameter định nghĩa cấu trúc dữ liệu truyền lên cho tác vụ Đăng nhập."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "namespace RentRoomManagement.Common.Param",
        "{",
        "    public class LoginParam",
        "    {",
        "        public string? Account { get; set; } // Tài khoản (thường là số điện thoại)",
        "        public string? Password { get; set; } // Mật khẩu",
        "        public Role Role { get; set; } // Vai trò đăng nhập (định dạng Enum Role)",
        "        public string? UserOauth2Id { get; set; } // ID xác thực OAuth2 từ Firebase",
        "        public string? UserName { get; set; } // Tên người dùng bên Google/Facebook",
        "        public string? UserEmail { get; set; } // Email liên kết bên Google/Facebook",
        "    }",
        "}"
    ]),
    createParagraph("Giải thích: Lớp này đóng vai trò là Data Transfer Object (DTO) nhận thông tin truyền từ API Client (phần body JSON) để tự động ánh xạ (serialize/deserialize) trong Controller.")
);

// 3.5 RegisterParam.cs
docChildren.push(
    createHeading2("3.5 File RegisterParam.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.Common/Param/RegisterParam.cs"),
    createParagraph("Mục đích: Lớp đối tượng Parameter định nghĩa cấu trúc dữ liệu gửi lên cho tác vụ Đăng ký tài khoản mới."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "namespace RentRoomManagement.Common.Param",
        "{",
        "    public class RegisterParam",
        "    {",
        "        public string Account { get; set; } // Số tài khoản/Số điện thoại đăng ký",
        "        public string Email { get; set; } // Địa chỉ Email liên hệ",
        "        public string FullName { get; set; } // Họ và tên",
        "        public string PhoneNumber { get; set; } // Số điện thoại",
        "        public string Password { get; set; } // Mật khẩu thô (sẽ băm SHA-256 sau)",
        "        public Role Role { get; set; } // Vai trò đăng ký",
        "    }",
        "}"
    ])
);

// 3.6 User.cs
docChildren.push(
    createHeading2("3.6 File User.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.Common/Entitites/User.cs"),
    createParagraph("Mục đích: Định nghĩa thực thể UserEntity tương thích 1-1 với cấu trúc bảng dữ liệu 'users' trong CSDL MySQL."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "[Table(\"users\")]",
        "public class UserEntity",
        "{",
        "    [Key]",
        "    public Guid user_id { get; set; } // ID duy nhất kiểu Guid",
        "    public string? account { get; set; } // Tài khoản số điện thoại",
        "    public string phone_number { get; set; } // Số điện thoại",
        "    public string second_phone_number { get; set; } // Số điện thoại phụ",
        "    public string? password_hash { get; set; } // Mã băm mật khẩu",
        "    public string? user_email { get; set; } // Địa chỉ Email",
        "    public string? user_avatar { get; set; } // Đường dẫn ảnh đại diện",
        "    public string? user_oauth2_id { get; set; } // ID đăng nhập mạng xã hội",
        "    public string user_name { get; set; } // Họ tên người dùng",
        "}"
    ]),
    createParagraph("Giải thích: Lớp sử dụng các Attribute của Dapper.Contrib/Entity Framework như [Table(\"users\")] để định danh bảng CSDL tương ứng và [Key] để chỉ ra khóa chính.")
);

// 3.7 Role.cs
docChildren.push(
    createHeading2("3.7 File Role.cs"),
    createParagraph("Đường dẫn: RentRoomManagement.Common/Enums/Role.cs"),
    createParagraph("Mục đích: Chứa Enum phân loại vai trò của người dùng trên toàn hệ thống để thống nhất giữa FE và BE."),
    createParagraph("Mã nguồn chi tiết:"),
    createCodeBlock([
        "namespace RentRoomManagement.Common.Enums",
        "{",
        "    public enum Role",
        "    {",
        "        Inkeeper = 1,     // Chủ trọ",
        "        Renter = 2,       // Người thuê phòng trọ",
        "        RoomSeeker = 3,   // Khách vãng lai đăng bài/tìm trọ",
        "        Admin = 4         // Quản trị viên hệ thống",
        "    }",
        "}"
    ]),
    createParagraph("Giải thích: Việc sử dụng Enum giúp code tường minh, tránh việc sử dụng các hằng số không rõ ý nghĩa (Magic Numbers) trong các câu lệnh kiểm tra logic phân quyền.")
);

// ================== PHẦN 4: ĐÁNH GIÁ VÀ KHUYẾN NGHỊ ==================
docChildren.push(
    createHeading1("Phần 4: Đánh Giá Hệ Thống & Khuyến Nghị Nâng Cấp"),
    createHeading2("1. Điểm mạnh nổi bật của hệ thống hiện tại"),
    createBullet("Cấu trúc thiết kế sạch sẽ: Hệ thống phân lớp logic rõ ràng (API, BL, DL, Common) giúp dễ dàng phát triển, bảo trì và mở rộng code."),
    createBullet("Hiệu năng cao: Kết hợp Dapper ORM với MySQL cho tốc độ truy vấn cơ sở dữ liệu tối ưu."),
    createBullet("Bảo mật cơ bản tốt: Mật khẩu người dùng được băm một chiều bằng SHA-256 và sử dụng cơ chế bảo mật JWT Token để quản lý phiên đăng nhập."),
    createBullet("Tích hợp OAuth2 tốt: Hệ thống sẵn sàng cho đăng nhập bằng Google/Facebook thông qua trung gian Firebase Auth."),

    createHeading2("2. Khuyết điểm và khuyến nghị cải tiến"),
    createBullet("Logic Quên mật khẩu cần chuyển về Backend: Hiện tại toàn bộ luồng OTP và xác thực quên mật khẩu đang được viết giả lập (Mock) hoàn toàn tại Frontend. Cần chuyển logic này về Backend bằng cách thiết kế API gửi OTP thực tế (qua SMS hoặc Email) và cập nhật mật khẩu mới trong Database."),
    createBullet("Bổ sung Salt khi băm mật khẩu: Nên sử dụng cơ chế 'Salt' (chuỗi ký tự ngẫu nhiên đi kèm mật khẩu trước khi băm SHA-256) hoặc nâng cấp lên thuật toán băm Bcrypt/Argon2 để ngăn chặn các cuộc tấn công dò bảng mã băm (Rainbow Table)."),
    createBullet("Token Refresh: Nên thiết kế thêm cơ chế Refresh Token để nâng cao độ bảo mật phiên làm việc thay vì chỉ dựa vào JWT Token đơn lẻ có thời gian hết hạn lâu (120 phút).")
);

// ================== XUẤT FILE WORD (.DOCX) ==================
const doc = new Document({
    sections: [
        {
            properties: {
                page: {
                    margin: {
                        top: 1440,    // 1 inch
                        bottom: 1440, // 1 inch
                        left: 1440,   // 1 inch
                        right: 1440   // 1 inch
                    }
                }
            },
            children: docChildren
        }
    ]
});

const outputDir = "D:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\file báo cáo\\đọc code";
const outputPath = path.join(outputDir, "DN-DK-QMK.docx");

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(outputPath, buffer);
    console.log(`Successfully generated word document at: ${outputPath}`);
}).catch(err => {
    console.error("Error generating docx document:", err);
});
