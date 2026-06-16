const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đường dẫn lưu file
const outputDir = 'D:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\file báo cáo\\đọc code';
const tempHtmlPath = path.join(outputDir, 'nguoi_thue.html');
const destDocxPath = path.join(outputDir, 'nguoi thue.docx');

// Nội dung HTML báo cáo phân tích mã nguồn chi tiết
const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Báo cáo Phân tích Mã nguồn - Phân hệ Người thuê</title>
<style>
    body {
        font-family: "Times New Roman", Times, serif;
        font-size: 12pt;
        line-height: 1.6;
        color: #000000;
    }
    .header {
        text-align: center;
        margin-bottom: 25pt;
    }
    .header h1 {
        font-size: 18pt;
        font-weight: bold;
        text-transform: uppercase;
        margin: 0;
        color: #1e3a8a;
    }
    .header h2 {
        font-size: 14pt;
        font-weight: bold;
        margin: 5pt 0 0 0;
        color: #4b5563;
    }
    h1.section-title {
        font-size: 15pt;
        font-weight: bold;
        color: #1e3a8a;
        border-bottom: 1.5pt solid #1e3a8a;
        margin-top: 22pt;
        margin-bottom: 8pt;
        padding-bottom: 3pt;
        text-transform: uppercase;
    }
    h2.subsection-title {
        font-size: 13pt;
        font-weight: bold;
        color: #2563eb;
        margin-top: 15pt;
        margin-bottom: 6pt;
    }
    h3.block-title {
        font-size: 12pt;
        font-weight: bold;
        color: #1d4ed8;
        margin-top: 10pt;
        margin-bottom: 4pt;
        font-style: italic;
    }
    p {
        text-align: justify;
        margin-top: 0;
        margin-bottom: 6pt;
        text-indent: 0.5in;
    }
    p.no-indent {
        text-indent: 0;
    }
    ul, ol {
        margin-top: 0;
        margin-bottom: 8pt;
        padding-left: 20pt;
    }
    li {
        margin-bottom: 4pt;
        text-align: justify;
    }
    table {
        border-collapse: collapse;
        width: 100%;
        margin-top: 12pt;
        margin-bottom: 12pt;
    }
    th, td {
        border: 1pt solid #a3a3a3;
        padding: 6pt 8pt;
        font-size: 11pt;
        text-align: left;
        vertical-align: top;
    }
    th {
        background-color: #f3f4f6;
        font-weight: bold;
    }
    pre {
        background-color: #f8fafc;
        border: 0.5pt solid #cbd5e1;
        padding: 8pt;
        font-family: "Consolas", "Courier New", monospace;
        font-size: 10pt;
        margin-top: 6pt;
        margin-bottom: 8pt;
        white-space: pre-wrap;
    }
    code {
        font-family: "Consolas", "Courier New", monospace;
        font-size: 10pt;
        background-color: #f1f5f9;
        padding: 1px 3px;
        border-radius: 2px;
    }
    .keyword { color: #0000ff; font-weight: bold; }
    .type { color: #2b91af; }
    .string { color: #a31515; }
    .comment { color: #008000; font-style: italic; }
    .highlight {
        background-color: #fef08a;
    }
</style>
</head>
<body>

    <div class="header">
        <h1>Báo cáo Phân tích Mã nguồn Chi tiết</h1>
        <h2>PHÂN HỆ QUẢN LÝ PHÒNG TRỌ (VAI TRÒ: NGƯỜI THUÊ - RENTER)</h2>
        <div style="font-style: italic; margin-top: 10pt;">
            Đường dẫn dự án FE: d:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\project đồ án\\Rental-Room<br>
            Đường dẫn dự án BE: d:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\project đồ án\\Rent_Room_Management-BE
        </div>
    </div>

    <!-- PHẦN 1 -->
    <h1 class="section-title">PHẦN 1: LOGIC XỬ LÝ TỔNG QUAN & LUỒNG DỮ LIỆU</h1>
    
    <p>Trong dự án quản lý phòng trọ, phân hệ dành cho <strong>Người thuê (Renter)</strong> được phát triển nhằm cung cấp các chức năng hỗ trợ thiết thực cho cuộc sống hàng ngày tại phòng trọ. Dưới đây là phân tích chi tiết về logic xử lý tổng quan, kiến trúc và luồng đi của dữ liệu.</p>

    <h2 class="subsection-title">1. Mục đích của phân hệ Người thuê</h2>
    <p class="no-indent">Mã nguồn của phân hệ Người thuê thực hiện giải quyết các bài toán sau:</p>
    <ul>
        <li><strong>Quản lý Thông tin phòng và Ghi chú (Room Info):</strong> Hiển thị thông tin tổng quan phòng đang thuê (địa chỉ, giá thuê, diện tích, tiện ích...) và dịch vụ phòng đi kèm (tiền điện, tiền nước, phí dịch vụ...). Người thuê có thể tùy ý sửa các thông tin ghi chú này để tự theo dõi.</li>
        <li><strong>Quản lý Chi tiêu (Expenses Management):</strong> Giúp người thuê ghi chép chi tiết các khoản chi tiêu hàng ngày. Phân loại rõ ràng thành hai nhóm chính là <em>Chi tiêu phòng trọ</em> (tiền đóng góp chung như tiền phòng, điện nước chung...) và <em>Chi tiêu cá nhân</em>.</li>
        <li><strong>Thống kê và Trực quan hóa chi tiêu:</strong> Tổng hợp toàn bộ dữ liệu chi tiêu trong năm để hiển thị trực quan dưới dạng biểu đồ đường xu hướng chi tiêu theo thời gian.</li>
    </ul>

    <h2 class="subsection-title">2. Kiến trúc và Luồng đi của dữ liệu (Data Flow)</h2>
    <p>Hệ thống áp dụng mô hình kiến trúc Client-Server tiêu chuẩn. Đối với từng chức năng, luồng dữ liệu được thiết kế như sau:</p>

    <h3 class="block-title">A. Luồng xử lý Ngoại tuyến (Offline - Local Storage) đối với Thông tin phòng trọ</h3>
    <p>Đối với chức năng xem và lưu trữ ghi chú thông tin phòng trọ (RoomInfo), dữ liệu được xử lý ngoại tuyến để tối ưu hóa tài nguyên hệ thống:</p>
    <ol>
        <li>Khi người dùng truy cập trang, hook <code>useRoomInfo</code> được kích hoạt và tự động gọi hàm <code>loadLocalNote()</code>.</li>
        <li>Hàm kiểm tra trong <code>LocalStorage</code> của trình duyệt xem có tồn tại dữ liệu ứng với key <code>renter-room-note-{userId}</code> hay không. Nếu có, dữ liệu JSON được chuyển đổi thành Object và gán vào 2 biến reactive là <code>roomInfoView</code> và <code>serviceInfoView</code> để hiển thị lên Vue template.</li>
        <li>Khi người thuê sửa thông tin ghi chú và bấm "Lưu", hàm <code>saveLocalNote()</code> được gọi để chuyển đổi dữ liệu thành chuỗi JSON và ghi đè vào <code>LocalStorage</code>, đồng thời hiển thị thông báo thành công.</li>
    </ol>

    <h3 class="block-title">B. Luồng xử lý Trực tuyến (Online - API & Database) đối với Chi tiêu và Danh mục</h3>
    <p>Đối với việc quản lý các khoản chi tiêu và danh mục loại chi phí, luồng dữ liệu đi qua toàn bộ các tầng của hệ thống:</p>
    <table style="width: 100%;">
        <thead>
            <tr>
                <th style="width: 25%;">Tầng (Layer)</th>
                <th style="width: 35%;">Thao tác phía FE (Frontend)</th>
                <th style="width: 40%;">Thao tác phía BE (Backend)</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Giao diện (View) & Controller</strong></td>
                <td>Người dùng thao tác trên Vue View (<code>Expense.vue</code>, <code>ExpenseCategoryList.vue</code>) -> gọi hàm logic tương ứng trong JS file (<code>expense.js</code>, <code>expenseCategoryList.js</code>).</td>
                <td>API nhận yêu cầu tại <code>ExpensesController.cs</code> hoặc <code>ExpenseCategoriesController.cs</code>, kế thừa từ lớp cha dùng chung <code>BasesController.cs</code>.</td>
            </tr>
            <tr>
                <td><strong>Lớp trung gian / Nghiệp vụ</strong></td>
                <td>File JS gửi yêu cầu đến Pinia Store (<code>expenseStore.js</code>, <code>ExpenseCategoryStore.js</code>) -> Store gọi hàm tương ứng trong API client (<code>expenseAPI.js</code>, <code>expenseCategoryAPI.js</code>).</td>
                <td>Controller chuyển tiếp yêu cầu đến tầng Business Logic <code>ExpenseBL.cs</code> / <code>ExpenseCategoryBL.cs</code> (kế thừa từ <code>BaseBL.cs</code>) để kiểm tra nghiệp vụ.</td>
            </tr>
            <tr>
                <td><strong>Truy cập dữ liệu (Data Access)</strong></td>
                <td>API client sử dụng Axios để đóng gói payload và gửi request HTTP (GET, POST, PUT, DELETE) lên Backend.</td>
                <td>Tầng BL gọi xuống tầng Data Access <code>ExpenseDL.cs</code> / <code>ExpenseCategoryDL.cs</code> (kế thừa từ <code>BaseDL.cs</code>). Tầng DL thực thi câu lệnh SQL qua Dapper hoặc gọi Store Procedure.</td>
            </tr>
        </tbody>
    </table>

    <h2 class="subsection-title">3. Các thuật toán và cơ chế đặc biệt sử dụng trong mã nguồn</h2>
    <ul>
        <li><strong>Thuật toán Thống kê Chi tiêu (Stored Procedure):</strong> Tại tầng DL, thay vì lấy toàn bộ danh sách chi tiêu lên bộ nhớ RAM rồi tính toán bằng C#, hệ thống giao nhiệm vụ này cho Database MySQL thông qua Store Procedure <code>GetExpenseStatistics</code>. Thuật toán gom nhóm dữ liệu theo nhãn thời gian và tính tổng số tiền (<code>SUM(expense_amount)</code>) giúp tăng tốc độ phản hồi đáng kể khi số lượng bản ghi lớn.</li>
        <li><strong>Cơ chế Dynamic Filter & Paging (Phân trang và Lọc động):</strong> Giao diện sử dụng <code>v-data-table-server</code> để phân trang từ xa. Phía Backend sử dụng cơ chế xử lý chuỗi động trong <code>BaseDL.cs</code> để tự động ánh xạ các cột lọc từ client gửi lên thành các mệnh đề <code>WHERE</code> và <code>ORDER BY</code> trong câu lệnh SQL một cách an toàn nhằm phòng chống lỗi truy vấn cột lạ và SQL Injection.</li>
        <li><strong>Cơ chế tự động dọn dẹp khóa ngoại đệ quy:</strong> Nhằm tránh lỗi xung đột ràng buộc khóa ngoại khi xóa bản ghi, lớp <code>BaseDL.cs</code> có một thuật toán đệ quy tự động quét cấu trúc khóa ngoại trong Database thông qua bảng hệ thống <code>INFORMATION_SCHEMA.KEY_COLUMN_USAGE</code> để tìm và xóa sạch các bản ghi phụ thuộc ở các bảng con khác trước khi tiến hành xóa bản ghi cha.</li>
    </ul>

    <!-- PHẦN 2 -->
    <h1 class="section-title">PHẦN 2: GIẢI THÍCH CHI TIẾT CÁC FILE GIAO DIỆN PHÍA FE (VUE, JS)</h1>
    <p>Dưới đây là phân tích chi tiết cấu trúc, chức năng và mã nguồn của các file giao diện người dùng phía Frontend.</p>

    <!-- RoomInfo -->
    <h2 class="subsection-title">1. Nhóm quản lý thông tin phòng trọ (Room Info)</h2>

    <h3 class="block-title">A. File giao diện: RoomInfo.vue</h3>
    <p>File này chịu trách nhiệm hiển thị giao diện thông tin chi tiết phòng trọ. Sử dụng các component Vuetify để dựng giao diện dạng thẻ (Card) và lưới (Grid Layout).</p>
    <ul>
        <li><code>v-window</code> và <code>v-window-item</code> (Dòng 4-15): Dùng để trình diễn slide ảnh phòng trọ.</li>
        <li><code>v-textarea</code> và <code>v-text-field</code> (Dòng 62-74 & 101-113): Tự động hiển thị ở dạng ô nhập dữ liệu (input) khi người dùng bật chế độ chỉnh sửa (<code>isView == false</code>), ngược lại chỉ hiển thị dạng text tĩnh.</li>
        <li><code>setup()</code> (Dòng 125-128): Nhúng hook logic <code>useRoomInfo()</code> từ file JS đồng hành để tách biệt mã nguồn giao diện và xử lý.</li>
    </ul>

    <h3 class="block-title">B. File logic xử lý: roomInfo.js</h3>
    <p>Chứa toàn bộ logic hoạt động ngoại tuyến của màn hình thông tin phòng trọ.</p>
    <pre>
<span class="keyword">export const</span> useRoomInfo = () => {
    <span class="keyword">const</span> { proxy } = getCurrentInstance();
    <span class="keyword">const</span> contextStore = useContextManageStore();
    <span class="keyword">const</span> onboarding = ref(1);

    <span class="comment">// Định nghĩa khóa lưu trữ động theo mã tài khoản người dùng đăng nhập</span>
    <span class="keyword">const</span> storageKey = <span class="string">\`renter-room-note-\${contextStore.\$state.user.user_id}\`</span>;

    <span class="comment">// Cấu trúc dữ liệu mặc định hiển thị thông tin chung</span>
    <span class="keyword">const</span> defaultRoomInfo = [
        { title: <span class="string">"Địa chỉ"</span>, value: <span class="string">""</span> },
        { title: <span class="string">"Giá thuê"</span>, value: <span class="string">""</span> },
        { title: <span class="string">"Diện tích"</span>, value: <span class="string">""</span> },
        { title: <span class="string">"Tiện ích"</span>, value: <span class="string">""</span> },
        { title: <span class="string">"Số phòng ngủ"</span>, value: <span class="string">""</span> },
        { title: <span class="string">"Ghi chú phòng"</span>, value: <span class="string">""</span>, componentType: <span class="string">"textarea"</span> }
    ];

    <span class="comment">// Hàm đọc dữ liệu từ LocalStorage của trình duyệt</span>
    <span class="keyword">const</span> loadLocalNote = () => {
        <span class="keyword">const</span> raw = localStorage.getItem(storageKey);
        <span class="keyword">if</span> (!raw) <span class="keyword">return</span>;
        <span class="keyword">try</span> {
            <span class="keyword">const</span> saved = JSON.parse(raw);
            <span class="keyword">if</span> (Array.isArray(saved.roomInfo)) roomInfoView.value = saved.roomInfo;
            <span class="keyword">if</span> (Array.isArray(saved.serviceInfo)) serviceInfoView.value = saved.serviceInfo;
        } <span class="keyword">catch</span> (error) { console.error(error); }
    };

    <span class="comment">// Hàm lưu dữ liệu vào LocalStorage khi người dùng nhấn nút "Lưu"</span>
    <span class="keyword">const</span> saveLocalNote = () => {
        localStorage.setItem(storageKey, JSON.stringify({
            roomInfo: roomInfoView.value,
            serviceInfo: serviceInfoView.value
        }));
        showMessage(<span class="string">"Đã lưu thông tin ghi chú phòng!"</span>);
    };

    <span class="comment">// Xử lý bật tắt trạng thái Chỉnh sửa / Xem chi tiết</span>
    <span class="keyword">const</span> handleEdit = (btnType) => {
        <span class="keyword">if</span> (btnType === buttonTypes.edit) {
            dataConfig.roomInfo.isView = !dataConfig.roomInfo.isView;
            <span class="keyword">if</span> (dataConfig.roomInfo.isView) {
                saveLocalNote(); <span class="comment">// Nếu chuyển về chế độ View thì tiến hành lưu</span>
                dataConfig.roomInfo.buttonType = buttonTypes.edit;
            } <span class="keyword">else</span> {
                dataConfig.roomInfo.buttonType = <span class="string">"Lưu"</span>;
            }
        }
    };
}</pre>

    <!-- Expense -->
    <h2 class="subsection-title">2. Nhóm quản lý chi tiêu (Expense)</h2>

    <h3 class="block-title">A. File giao diện: Expense.vue</h3>
    <p>Layout chứa biểu đồ trực quan hóa dữ liệu và chứa các bảng danh sách chi tiêu.</p>
    <ul>
        <li><code>v-tabs</code> và <code>v-tabs-window</code> (Dòng 5-12): Quản lý cơ chế chuyển tab mượt mà giữa "Tổng quan", "Phòng trọ" và "Cá nhân".</li>
        <li><code>v-sparkline</code> (Dòng 17-50): Component vẽ biểu đồ đường xu hướng chi tiêu tự động dựa trên mảng dữ liệu <code>value</code> và nhãn <code>labels</code>.</li>
        <li><code>room-expense-list</code> và <code>person-expense-list</code> (Dòng 57-69): Các sub-component hiển thị danh sách chi tiêu tương ứng.</li>
    </ul>

    <h3 class="block-title">B. File logic xử lý: expense.js</h3>
    <p>Cấu hình các cột bảng hiển thị chi tiêu, mảng dữ liệu biểu đồ xu hướng, đồng thời gửi yêu cầu tải dữ liệu thống kê từ Backend khi component được khởi tạo (<code>onMounted</code>).</p>
    <ul>
        <li><code>headers</code> (Dòng 10-23): Định nghĩa các cột hiển thị chi tiêu gồm: Tên loại chi, Số tiền chi, Ngày chi, Ngày tạo, Ghi chú và cột chức năng (Sửa/Xóa).</li>
        <li><code>onMounted</code> (Dòng 81-87): Lấy năm hiện tại và <code>user_id</code> tài khoản để gọi API <code>store.getExpenseStatistic(payload)</code> để tải dữ liệu thống kê từ máy chủ.</li>
    </ul>

    <h3 class="block-title">C. File logic danh sách chi tiêu: roomExpenseList.js & personExpenseList.js</h3>
    <p>Các file này cấu hình trạng thái lọc cho Store dùng chung trước khi load dữ liệu:</p>
    <ul>
        <li>Trong <code>roomExpenseList.js</code>, cờ <code>store.$state.isRoom = true</code> được gán để chỉ tải chi phí chung của phòng trọ (<code>is_personal = 0</code>).</li>
        <li>Trong <code>personExpenseList.js</code>, cờ <code>store.$state.isPersonal = true</code> được gán để chỉ tải chi phí riêng của cá nhân người thuê (<code>is_personal = 1</code>).</li>
        <li>Khi hủy component (<code>onUnmounted</code>), gọi <code>store.$reset()</code> để dọn dẹp bộ nhớ lưu trữ tạm thời.</li>
    </ul>

    <h3 class="block-title">D. File logic chi tiết chi tiêu: expenseDetail.js</h3>
    <p>Xử lý nghiệp vụ trên form popup thêm mới/sửa thông tin chi tiêu.</p>
    <ul>
        <li><code>onSelectExpenseCategory</code> (Dòng 26-35): Khi người dùng chọn một loại danh mục chi tiêu từ Combobox, hàm tự động điền tên loại chi tiêu (<code>expense_category_name</code>) tương ứng vào bản ghi hiện tại.</li>
        <li><code>customBeforeSubmit</code> (Dòng 37-40): Tự động gán mã <code>user_id</code> của người dùng đăng nhập và cờ <code>is_personal</code> vào payload để đảm bảo dữ liệu ghi nhận đúng người sở hữu.</li>
        <li><code>onMounted</code> (Dòng 49-51): Tải toàn bộ danh mục chi tiêu sẵn có từ <code>expenseCategoryStore.getAllItems()</code> để nạp vào danh sách lựa chọn của người dùng.</li>
    </ul>

    <h2 class="subsection-title">3. Các file kết nối mạng và quản lý dữ liệu (APIs &amp; Stores)</h2>
    <p>Hệ thống sử dụng các API kết nối mạng và quản lý trạng thái tập trung:</p>
    <ul>
        <li><strong>expenseAPI.js:</strong> Định nghĩa endpoint API <code>"Expenses"</code> kết nối với máy chủ. Phương thức <code>getExpenseStatistic(payload)</code> gửi yêu cầu <code>POST</code> đến địa chỉ <code>/Expenses/statistic</code> để lấy dữ liệu thống kê từ Server.</li>
        <li><strong>expenseStore.js:</strong> Kế thừa từ <code>BaseDicStore</code>. Định nghĩa <code>defaultFilters</code> (Dòng 39-61) tự động đính kèm bộ lọc theo <code>user_id</code> của tài khoản đang đăng nhập vào mọi yêu cầu phân trang, đồng thời tự động chèn cờ <code>is_personal</code> dựa trên tab hiện tại để lọc dữ liệu trực tiếp tại Database.</li>
    </ul>

    <!-- PHẦN 3 -->
    <h1 class="section-title">PHẦN 3: GIẢI THÍCH CHI TIẾT CÁC FILE XỬ LÝ LOGIC PHÍA BE (C#)</h1>
    <p>Phần này phân tích chi tiết các file mã nguồn C# chịu trách nhiệm thực thi các logic nghiệp vụ và truy vấn dữ liệu chi tiêu trên máy chủ Backend.</p>

    <!-- ExpensesController -->
    <h2 class="subsection-title">1. Lớp điều phối API: ExpensesController.cs</h2>
    <p>Lớp này tiếp nhận các request HTTP từ Client liên quan đến chi tiêu.</p>
    <pre>
[Authorize] <span class="comment">// Yêu cầu người dùng phải đăng nhập (JWT Token) để truy cập API</span>
<span class="keyword">public class</span> <span class="type">ExpensesController</span> : <span class="type">BasesController</span>&lt;<span class="type">ExpenseEntity</span>, <span class="type">ExpenseEntity</span>&gt;
{
    <span class="type">IExpenseBL</span> _expenseBL;

    <span class="comment">// Constructor injection: Inject business logic layer thông qua Dependency Injection (DI)</span>
    <span class="keyword">public</span> ExpensesController(<span class="type">IExpenseBL</span> baseBL) : <span class="keyword">base</span>(baseBL)
    {
        _expenseBL = baseBL;
    }

    <span class="comment">// Định nghĩa API thống kê chi tiêu tùy chỉnh</span>
    [HttpPost(<span class="string">"statistic"</span>)]
    <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">IActionResult</span>&gt; GetExpenseStatistic(<span class="type">ExpenseStatisticParam</span> statisticParam)
    {
        <span class="comment">// Gọi đến lớp BL để xử lý logic thống kê</span>
        <span class="keyword">var</span> res = <span class="keyword">await</span> _expenseBL.GetExpenseStatisticsAsync(statisticParam);
        <span class="keyword">return</span> Ok(res); <span class="comment">// Trả về mã thành công HTTP 200 OK kèm dữ liệu thống kê</span>
    }
}</pre>

    <!-- ExpenseBL -->
    <h2 class="subsection-title">2. Lớp nghiệp vụ: ExpenseBL.cs</h2>
    <p>Lớp này xử lý quy tắc nghiệp vụ. Vì chức năng chi tiêu kế thừa các nghiệp vụ CRUD cơ bản từ lớp cha dùng chung <code>BaseBL</code>, lớp này chỉ định nghĩa thêm phương thức thống kê:</p>
    <pre>
<span class="keyword">public class</span> <span class="type">ExpenseBL</span> : <span class="type">BaseBL</span>&lt;<span class="type">ExpenseEntity</span>, <span class="type">ExpenseEntity</span>&gt;, <span class="type">IExpenseBL</span>
{
    <span class="type">IExpenseDL</span> _expenseDL;
    <span class="keyword">public</span> ExpenseBL(<span class="type">IExpenseDL</span> baseDL) : <span class="keyword">base</span>(baseDL)
    {
        _expenseDL = baseDL;
    }

    <span class="comment">// Chuyển tiếp yêu cầu lấy thống kê chi tiêu xuống tầng truy cập dữ liệu DL</span>
    <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">List</span>&lt;<span class="type">StatisticDto</span>&gt;&gt; GetExpenseStatisticsAsync(<span class="type">ExpenseStatisticParam</span> statisticParam)
    {
        <span class="keyword">return await</span> _expenseDL.GetExpenseStatisticsAsync(statisticParam);
    }
}</pre>

    <!-- ExpenseDL -->
    <h2 class="subsection-title">3. Lớp truy cập cơ sở dữ liệu: ExpenseDL.cs</h2>
    <p>Lớp này kết nối trực tiếp đến Database MySQL và thực thi các câu lệnh truy vấn dữ liệu chi tiêu.</p>
    <pre>
<span class="keyword">public class</span> <span class="type">ExpenseDL</span> : <span class="type">BaseDL</span>&lt;<span class="type">ExpenseEntity</span>, <span class="type">ExpenseEntity</span>&gt;, <span class="type">IExpenseDL</span>
{
    <span class="comment">// Hàm lấy dữ liệu thống kê chi tiêu qua Store Procedure</span>
    <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">List</span>&lt;<span class="type">StatisticDto</span>&gt;&gt; GetExpenseStatisticsAsync(<span class="type">ExpenseStatisticParam</span> statisticParam)
    {
        <span class="keyword">var</span> result = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="type">StatisticDto</span>&gt;();

        <span class="comment">// Khởi tạo kết nối MySQL sử dụng Connection String cấu hình hệ thống</span>
        <span class="keyword">using</span> (<span class="keyword">var</span> connection = <span class="keyword">new</span> <span class="type">MySqlConnection</span>(<span class="type">DatabaseContext</span>.ConnectionString))
        {
            <span class="comment">// Gọi Store Procedure tên là "GetExpenseStatistics"</span>
            <span class="keyword">using</span> (<span class="keyword">var</span> command = <span class="keyword">new</span> <span class="type">MySqlCommand</span>(<span class="string">"GetExpenseStatistics"</span>, connection))
            {
                command.CommandType = <span class="type">CommandType</span>.StoredProcedure;

                <span class="comment">// Ánh xạ các tham số từ client vào Store Procedure</span>
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@p_year"</span>, statisticParam.Year));
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@p_month"</span>, statisticParam.Month));
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@p_week"</span>, statisticParam.Week));
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@p_day"</span>, statisticParam.Day));
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@p_hour"</span>, statisticParam.Hour));
                command.Parameters.Add(<span class="keyword">new</span> <span class="type">MySqlParameter</span>(<span class="string">"@user_id"</span>, statisticParam.userId));

                <span class="keyword">await</span> connection.OpenAsync(); <span class="comment">// Mở kết nối bất đồng bộ đến DB</span>

                <span class="comment">// Thực thi câu lệnh và lấy đầu đọc dữ liệu</span>
                <span class="keyword">using</span> (<span class="keyword">var</span> reader = <span class="keyword">await</span> command.ExecuteReaderAsync())
                {
                    <span class="keyword">while</span> (<span class="keyword">await</span> reader.ReadAsync())
                    {
                        <span class="comment">// Đọc nhãn thời gian và tổng tiền của từng nhóm chi tiêu</span>
                        <span class="keyword">var</span> label = reader.GetString(reader.GetOrdinal(<span class="string">"label"</span>));
                        <span class="keyword">var</span> totalAmount = reader.GetDouble(reader.GetOrdinal(<span class="string">"total_amount"</span>));

                        result.Add(<span class="keyword">new</span> <span class="type">StatisticDto</span>()
                        {
                            Label = label,
                            TotalAmount = totalAmount
                        });
                    }
                }
            }
        }
        <span class="keyword">return</span> result;
    }
}</pre>

    <!-- PHẦN 4 -->
    <h1 class="section-title">PHẦN 4: PHÂN TÍCH TẦNG DÙNG CHUNG (BASE LAYERS) &amp; CHỈ ĐỊNH DÒNG CODE</h1>
    <p>Tầng dùng chung đóng vai trò nền tảng, chứa toàn bộ các thuật toán thực thi CRUD động để giải phóng lập trình viên khỏi việc viết các câu lệnh truy vấn lặp đi lặp lại. Dưới đây là phân tích chi tiết chức năng cụ thể và chỉ định số dòng mã của từng khối lệnh quan trọng trong tầng dùng chung này.</p>

    <!-- BasesController -->
    <h2 class="subsection-title">1. Tầng Controller dùng chung: BasesController.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.API/Controllers/BasesController.cs">BasesController.cs</a></p>
    <ul>
        <li><strong>Dòng 35 - 63 [Hàm GetPaging]:</strong> 
            <br><em>Chức năng:</em> API phân trang và lọc dữ liệu động. Nhận thông số phân trang và lọc từ Client, gọi BL xử lý. Nếu thành công trả về HTTP 200 kèm danh sách phân trang, nếu lỗi trả về HTTP 404 hoặc 500 kèm thông báo lỗi chuẩn.
        </li>
        <li><strong>Dòng 69 - 97 [Hàm GetAllRecords]:</strong> 
            <br><em>Chức năng:</em> Lấy toàn bộ dữ liệu của thực thể trong Database mà không phân trang (dùng cho các danh mục dạng dropdown).
        </li>
        <li><strong>Dòng 105 - 136 [Hàm GetByID]:</strong> 
            <br><em>Chức năng:</em> Lấy chi tiết một bản ghi theo khóa chính (Guid) được truyền từ đường dẫn (Route).
        </li>
        <li><strong>Dòng 170 - 182 [Hàm InsertAsync]:</strong> 
            <br><em>Chức năng:</em> API thêm mới một bản ghi. Đóng vai trò là phương thức ảo (virtual) để các Controller con có thể ghi đè (override) khi cần xử lý trước hoặc sau khi thêm mới.
        </li>
        <li><strong>Dòng 190 - 231 [Hàm DeleteMultipleFixedAsset]:</strong> 
            <br><em>Chức năng:</em> Xóa đồng thời nhiều bản ghi (xóa hàng loạt - Batch Delete) dựa trên danh sách các ID được gửi lên dưới dạng JSON Array.
        </li>
        <li><strong>Dòng 240 - 252 [Hàm UpdateAsync]:</strong> 
            <br><em>Chức năng:</em> Cập nhật thông tin bản ghi. Nhận vào thực thể thay đổi và gọi xuống BL để cập nhật.
        </li>
        <li><strong>Dòng 262 - 293 [Hàm DeleteFixedAsset]:</strong> 
            <br><em>Chức năng:</em> Xóa một bản ghi đơn lẻ theo ID.
        </li>
    </ul>

    <!-- BaseBL -->
    <h2 class="subsection-title">2. Tầng Business Logic dùng chung: BaseBL.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.BL/BaseBL/BaseBL.cs">BaseBL.cs</a></p>
    <ul>
        <li><strong>Dòng 35 - 51 [Hàm GetPaging]:</strong> 
            <br><em>Chức năng:</em> Xử lý bộ lọc trước khi truy vấn cơ sở dữ liệu. Hỗ trợ tìm kiếm nhanh (Quick Search) bằng cách tự động sao chép từ khóa tìm kiếm (SearchItem.Value) và tạo thành các điều kiện <code>OR</code> (Operator: Contains) trên các cột được cấu hình.
        </li>
        <li><strong>Dòng 109 - 118 [Hàm InsertSync]:</strong> 
            <br><em>Chức năng:</em> Thực hiện luồng chèn dữ liệu đồng bộ. Gọi hàm <code>BeforeInsert()</code> để kiểm tra tiền xử lý dữ liệu, gọi tầng DL để lưu vào Database, sau đó kích hoạt callback <code>AfterInsertSync()</code> để thực hiện các nghiệp vụ bổ sung (nếu có).
        </li>
        <li><strong>Dòng 131 - 170 [Hàm EnsureKeyValue]:</strong> 
            <br><em>Chức năng:</em> Thuật toán đảm bảo tính toàn vẹn khóa chính. Hàm sử dụng kỹ thuật Reflection của C# để quét các thuộc tính được đánh dấu bằng annotation <code>[Key]</code>. Nếu khóa chính đang rỗng, hệ thống tự động gán giá trị Guid mới (<code>Guid.NewGuid()</code>) trước khi ghi vào Database.
        </li>
    </ul>

    <!-- BaseDL -->
    <h2 class="subsection-title">3. Tầng Data Access dùng chung: BaseDL.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.DL/BaseDL/BaseDL.cs">BaseDL.cs</a></p>
    <ul>
        <li><strong>Dòng 28 - 114 [Hàm NormalizeFilterFieldsAsync]:</strong> 
            <br><em>Chức năng:</em> Thuật toán chuẩn hóa bộ lọc. Nhận bộ lọc từ client, truy vấn metadata hệ thống <code>INFORMATION_SCHEMA.COLUMNS</code> của MySQL để lấy danh sách cột thực tế, loại bỏ hoặc ánh xạ lại các cột không khớp để tránh lỗi câu lệnh SQL.
        </li>
        <li><strong>Dòng 241 - 299 [Hàm GetPaging]:</strong> 
            <br><em>Chức năng:</em> Sử dụng Dapper để build câu lệnh SQL phân trang động dựa trên bộ lọc đã chuẩn hóa, thực thi lấy danh sách phân trang và tổng số lượng bản ghi để trả về cho Client.
        </li>
        <li><strong>Dòng 401 - 439 [Hàm GetNextCode]:</strong> 
            <br><em>Chức năng:</em> Thuật toán sinh mã tự động. Gọi Stored Procedure để lấy mã gần nhất, dùng Regex trích xuất số ở đuôi, cộng 1 đơn vị, đệm thêm các số '0' ở đầu để giữ nguyên độ dài mẫu mã và trả về mã mới.
        </li>
        <li><strong>Dòng 514 - 559 [Hàm DeleteMultipleFixedAsset]:</strong> 
            <br><em>Chức năng:</em> Xóa nhiều bản ghi bằng Stored Procedure trong một <strong>Transaction</strong>. Thực hiện rollback nếu số lượng bản ghi bị xóa thực tế khác số lượng yêu cầu.
        </li>
        <li><strong>Dòng 625 - 679 [Hàm DeleteByID]:</strong> 
            <br><em>Chức năng:</em> Thực hiện câu lệnh SQL DELETE. Nếu xảy ra lỗi ràng buộc khóa ngoại (MySQL Error 1451/1217), hàm tự động gọi đệ quy <code>DeleteReferencingRowsRecursive</code> để quét cấu trúc khóa ngoại trong Database và xóa sạch các bản ghi phụ thuộc ở các bảng con khác trước rồi mới tiến hành xóa bản ghi cha.
        </li>
        <li><strong>Dòng 681 - 740 [Hàm DeleteReferencingRowsRecursive]:</strong> 
            <br><em>Chức năng:</em> Hàm trợ giúp đệ quy quét cấu trúc khóa ngoại của MySQL để lấy danh sách khóa chính bảng con liên quan và thực thi xóa dọn đường.
        </li>
    </ul>

</body>
</html>
`;

// Ghi file HTML tạm thời
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}
fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');
console.log('Đã tạo xong file HTML tạm thời.');

// Lệnh PowerShell sử dụng relative paths để tránh lỗi font/accents
const psCommand = `
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    # Mở file HTML bằng relative path dựa trên thư mục hiện hành
    $htmlPath = Join-Path (Get-Location).Path "nguoi_thue.html"
    $docxPath = Join-Path (Get-Location).Path "nguoi thue.docx"
    
    $doc = $word.Documents.Open($htmlPath)
    
    # Thiết lập định dạng trang A4
    $doc.PageSetup.PaperSize = 7 # wdPaperA4 = 7
    
    # Thiết lập lề 2.0 cm (56.7 points)
    $doc.PageSetup.TopMargin = 56.7
    $doc.PageSetup.BottomMargin = 56.7
    $doc.PageSetup.LeftMargin = 56.7
    $doc.PageSetup.RightMargin = 56.7
    
    # Lưu dưới dạng DOCX (wdFormatXMLDocument = 12)
    $doc.SaveAs($docxPath, 12)
    $doc.Close()
    Write-Output "Word document generated successfully."
} catch {
    Write-Error "Error during Word document generation: $_"
} finally {
    $word.Quit()
}
`;

// Ghi lệnh PowerShell ra file script tạm thời trong thư mục outputDir
const tempPsScriptPath = path.join(outputDir, 'convert.ps1');
fs.writeFileSync(tempPsScriptPath, psCommand, 'utf8');

console.log('Đang chạy PowerShell script để tạo file DOCX...');
try {
    // Chạy lệnh powershell từ thư mục làm việc là outputDir để bảo đảm relative paths hoạt động đúng
    const output = execSync('powershell -ExecutionPolicy Bypass -File "convert.ps1"', { 
        cwd: outputDir,
        encoding: 'utf8' 
    });
    console.log(output);
    
    // Dọn dẹp các file tạm
    if (fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
    }
    if (fs.existsSync(tempPsScriptPath)) {
        fs.unlinkSync(tempPsScriptPath);
    }
    console.log('Đã hoàn thành! Đã tạo file docx thành công và dọn dẹp các file phụ trợ.');
} catch (error) {
    console.error('Lỗi khi thực thi script PowerShell:', error);
}
