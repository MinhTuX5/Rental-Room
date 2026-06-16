const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Đường dẫn lưu file
const outputDir = 'D:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\file báo cáo\\đọc code';
const tempHtmlPath = path.join(outputDir, 'quan_ly_bai_dang.html');
const destDocxPath = path.join(outputDir, 'quan ly bai dang.docx');

// Nội dung HTML báo cáo phân tích mã nguồn chi tiết cho phần Quản lý bài đăng
const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Báo cáo Phân tích Mã nguồn - Phân hệ Quản lý Bài đăng</title>
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
        <h2>PHÂN HỆ QUẢN LÝ BÀI ĐĂNG (VAI TRÒ: NGƯỜI ĐĂNG BÀI & QUẢN TRỊ VIÊN)</h2>
        <div style="font-style: italic; margin-top: 10pt;">
            Đường dẫn dự án FE: d:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\project đồ án\\Rental-Room<br>
            Đường dẫn dự án BE: d:\\ĐỒ ÁN TỐT NGHIỆP\\De Tai 2\\project đồ án\\Rent_Room_Management-BE
        </div>
    </div>

    <!-- PHẦN 1 -->
    <h1 class="section-title">PHẦN 1: LOGIC XỬ LÝ TỔNG QUAN & LUỒNG DỮ LIỆU</h1>
    
    <p>Trong hệ thống quản lý phòng trọ, chức năng <strong>Quản lý Bài đăng (Post Management)</strong> là một cầu nối quan trọng giữa chủ phòng trọ (người đăng bài) và người tìm kiếm phòng trọ (người thuê). Phân hệ này được thiết kế và triển khai chặt chẽ trên cả hai vai trò: <strong>Người đăng bài (Innkeeper / Poster)</strong> để quản lý các bài viết của mình và <strong>Quản trị viên (Admin / Manager)</strong> để kiểm duyệt các bài viết trước khi chúng xuất hiện công khai trên hệ thống.</p>

    <h2 class="subsection-title">1. Mục đích và Quy trình nghiệp vụ</h2>
    <p class="no-indent">Mã nguồn của phân hệ quản lý bài đăng giải quyết các bài toán sau:</p>
    <ul>
        <li><strong>Vai trò Người đăng bài (Innkeeper):</strong> Cho phép chủ trọ quản lý vòng đời bài đăng của họ qua 4 trạng thái chính: <em>Bài đã lưu (Bản nháp - Saved)</em>, <em>Chờ phê duyệt (WaitingForApproval)</em>, <em>Bài đã đăng (Công khai - Posted)</em>, và <em>Danh sách bài viết yêu thích (Favorite)</em>. Chủ trọ có thể tạo mới bài đăng, sửa bài đăng nháp/chờ duyệt, ẩn bài đăng đã đăng, xóa bài viết hoặc gửi duyệt lên hệ thống. Ngoài ra còn hỗ trợ tính năng liên kết tài khoản và sinh bài đăng tự động từ trang quản lý dữ liệu phòng trọ.</li>
        <li><strong>Vai trò Quản trị viên (Admin):</strong> Cung cấp giao diện kiểm duyệt danh sách các bài đăng đang chờ phê duyệt. Admin xem xét thông tin chi tiết của bài đăng (địa chỉ, giá cả, diện tích, hình ảnh...) để ra quyết định Duyệt bài (chuyển trạng thái sang Posted) hoặc Từ chối duyệt (yêu cầu sửa đổi kèm theo lý do từ chối cụ thể).</li>
    </ul>

    <h2 class="subsection-title">2. Kiến trúc và Luồng đi của dữ liệu (Data Flow)</h2>
    <p>Hệ thống áp dụng mô hình kiến trúc Client-Server 3 lớp (3-Tier) tiêu chuẩn phối hợp chặt chẽ giữa Frontend (Vue.js, Pinia, Vuetify) và Backend (.NET API, Business Logic Layer, Data Access Layer, Database MySQL):</p>

    <h3 class="block-title">A. Luồng xử lý dành cho Người đăng bài (Chủ trọ)</h3>
    <ol>
        <li><strong>Hiển thị & Lọc dữ liệu:</strong> Chủ trọ truy cập giao diện quản lý bài đăng (<code>PostManagement.vue</code>) -> Component kích hoạt hàm logic trong <code>postManagement.js</code> -> gửi yêu cầu lấy danh sách bài viết qua Pinia Store <code>roomPostStore.js</code>. Store gọi API client <code>roomPostAPI</code> thực hiện HTTP GET <code>/api/v1/RoomPosts/my-posts/{userID}</code> lên Server.</li>
        <li><strong>Nhận diện & phân loại trạng thái ở Client:</strong> Backend truy vấn tất cả bài viết của chủ trọ đó từ Database và trả về Client. Tại Frontend, các Computed Properties (<code>postedPosts</code>, <code>savedPosts</code>, <code>waitingPosts</code>) sẽ tự động chạy thuật toán lọc phân loại dữ liệu theo cột trạng thái (<code>post_status</code>) để phân bổ hiển thị vào đúng các tab Vuetify tương ứng, giúp giảm số lần gọi API lên Server.</li>
        <li><strong>Cập nhật trạng thái bài viết (Đăng bài, Ẩn bài):</strong> Khi chủ trọ nhấn "Đăng bài" (đối với bài nháp) hoặc "Ẩn bài" (đối với bài đã đăng), Frontend gửi request PUT đến endpoint <code>/api/v1/RoomPosts/post-status</code> kèm payload thay đổi trạng thái. Server tiếp nhận, thực thi cập nhật trong Database MySQL và trả về kết quả. Frontend nhận phản hồi thành công sẽ tải lại dữ liệu mới nhất (<code>loadData</code>) và tự động chuyển hướng tab hiển thị phù hợp.</li>
    </ol>

    <h3 class="block-title">B. Luồng xử lý dành cho Quản trị viên (Admin - Duyệt bài)</h3>
    <ol>
        <li><strong>Tải dữ liệu phân trang đầu cuối (Server-side Paging):</strong> Giao diện duyệt bài của Admin (<code>PostApproval.vue</code>) hiển thị danh sách bài đăng chờ duyệt. Vì danh sách chờ duyệt trên hệ thống có thể cực kỳ lớn, hệ thống sử dụng thuật toán phân trang server-side thông qua API <code>/api/v1/RoomPosts/filter-list</code>.</li>
        <li><strong>Xây dựng bộ lọc động phía Client:</strong> Hàm <code>changePage</code> tạo payload phân trang (<code>Skip</code>, <code>Take</code>) và tự động đính kèm bộ lọc tĩnh <code>post_status = PostStatus.WaitingForApproval</code> (trạng thái chờ duyệt = 2).</li>
        <li><strong>Truy vấn và Phân trang phía Server:</strong> Request HTTP POST gửi đến <code>RoomPostsController.GetPagingCustom</code>. Lớp Controller chuyển tiếp xuống <code>RoomPostBL.GetPagingCustom</code> -> gọi <code>BaseDL.GetPaging</code>. Tại đây, câu lệnh SQL phân trang động được Dapper sinh ra, thực thi đồng thời 2 truy vấn: lấy dữ liệu bản ghi trang hiện tại (kèm theo <code>LIMIT Skip, Take</code>) và đếm tổng số bản ghi chờ duyệt (<code>COUNT(*)</code>). Dữ liệu sau đó được trả về Client để cập nhật giao diện phân trang.</li>
        <li><strong>Thực thi Phê duyệt/Từ chối:</strong> Admin nhấn Duyệt hoặc Từ chối trên giao diện chi tiết, API PUT <code>/post-status</code> được kích hoạt để thay đổi trạng thái bản ghi trong Database.</li>
    </ol>

    <h2 class="subsection-title">3. Điểm đặc biệt và Lưu ý kỹ thuật (Discrepancies & Enhancements)</h2>
    <ul>
        <li><strong>Cơ chế tự động lưu Đặc điểm phòng trọ (AfterInsertSync):</strong> Tại tầng Business Logic (<code>RoomPostBL.cs</code>), khi chủ trọ lưu một bài viết thành công, hệ thống tự động giải mã cột đặc điểm phòng trọ (<code>room_characteristic</code> - định dạng JSON String) thành danh sách các mã số và lưu từng đặc điểm vào bảng ánh xạ bộ lọc <code>RoomFilterEntity</code>. Điều này tối ưu hóa hiệu năng tìm kiếm phòng trọ sau này bằng cách chuẩn hóa các thuộc tính phòng trọ thành dạng quan hệ thay vì lưu dạng chuỗi thô.</li>
        <li><strong>Thuật toán Lọc đặc điểm bằng JSON_CONTAINS của MySQL:</strong> Khi lọc bài viết theo nhiều đặc điểm trên giao diện, tầng Data Access (<code>RoomPostDL.cs</code>) sử dụng thuật toán build câu lệnh SQL động tích hợp hàm <code>JSON_CONTAINS</code> của MySQL. Cơ chế này đảm bảo tìm kiếm chính xác các bài viết có thuộc tính JSON khớp hoàn toàn với danh sách đặc điểm yêu cầu mà không cần thực hiện các phép join phức tạp.</li>
        <li><strong><span class="highlight">Phát hiện lỗi bất nhất giữa FE và BE (Discrepancy Warning):</span></strong> Trong file <code>postManagement.js</code> (FE) có định nghĩa tính năng "Sinh bài đăng" từ dữ liệu phòng trọ quản lý (hàm <code>genPostsFromManagement</code>) gửi request POST đến endpoint <code>/generating</code> của API <code>RoomPosts</code>. Phía Backend đã định nghĩa lớp tham số nhận dữ liệu <code>PostGeneratingParam.cs</code> trong tầng Common, nhưng <strong>chưa hề cấu hình endpoint <code>/generating</code> trong <code>RoomPostsController.cs</code> cũng như logic xử lý trong <code>RoomPostBL.cs</code></strong>. Đây là tính năng chưa được hoàn thiện ở phía Backend (hoặc bị bỏ sót) cần được bổ sung lập tức để tránh lỗi HTTP 404 khi người dùng nhấn nút "Sinh bài đăng" trên giao diện.</li>
    </ul>

    <!-- PHẦN 2 -->
    <h1 class="section-title">PHẦN 2: GIẢI THÍCH CHI TIẾT CÁC FILE GIAO DIỆN PHÍA FE (VUE, JS)</h1>
    <p>Dưới đây là phân tích chi tiết cấu trúc, chức năng và mã nguồn của các file giao diện người dùng phía Frontend.</p>

    <h2 class="subsection-title">1. File giao diện chủ trọ: PostManagement.vue</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rental-Room/src/views/roomSearch/postManagement/PostManagement.vue">PostManagement.vue</a></p>
    <p>File này xây dựng giao diện quản lý bài viết của chủ trọ bằng Vuetify. Nó chia thành 4 tab hiển thị tương ứng với các trạng thái bài viết.</p>

    <h3 class="block-title">Khối lệnh Template & Tabs phân chia trạng thái (Dòng 1 - 36):</h3>
    <pre>
&lt;template&gt;
  &lt;v-container class="post-management"&gt;
    <span class="comment">&lt;!-- Vùng quản lý tab chuyển đổi giữa các trạng thái bài viết --&gt;</span>
    &lt;v-tabs v-model="tabIndex" class="mb-4" @update:modelValue="onChangeTab"&gt;
      &lt;v-tab :value="PostStatus.Posted"&gt;Bài đã đăng&lt;/v-tab&gt;
      &lt;v-tab :value="PostStatus.Saved"&gt;Bài đã lưu&lt;/v-tab&gt;
      &lt;v-tab :value="PostStatus.WaitingForApproval"&gt;Chờ phê duyệt&lt;/v-tab&gt;
      &lt;v-tab :value="tabVals.favoritePosts"&gt;Yêu thích&lt;/v-tab&gt;
    &lt;/v-tabs&gt;
    
    &lt;v-tabs-window v-model="tabIndex"&gt;
      <span class="comment">&lt;!-- Tab hiển thị các bài viết Đã đăng thành công (Trạng thái công khai) --&gt;</span>
      &lt;v-tabs-window-item :value="PostStatus.Posted"&gt;
        <span class="comment">&lt;!-- Sử dụng v-virtual-scroll tối ưu hóa hiệu năng render danh sách lớn --&gt;</span>
        &lt;v-virtual-scroll
          v-if="postedPosts.length &gt; 0"
          :items="postedPosts"
          :height="heightOfList"
        &gt;
          &lt;template v-slot:default="{ item }"&gt;
            <span class="comment">&lt;!-- Component hiển thị chi tiết thẻ bài đăng --&gt;</span>
            &lt;post-overview
              :item="item"
              :isShowLikeIcon="false"
              :isShowFeatureBtn="true"
              <span class="comment">&lt;!-- Cột chức năng cho phép Xóa hoặc Ẩn bài đăng --&gt;</span>
              :displayed-btns="[featureBtns.Delete, featureBtns.Hide]"
              @delete="onAfterDelete"
              @hidePost="hidePost"
            &gt;&lt;/post-overview&gt;
          &lt;/template&gt;
        &lt;/v-virtual-scroll&gt;
        ...
      &lt;/v-tabs-window-item&gt;</pre>
    <ul>
        <li><code>v-tabs</code> (Dòng 3-8): Liên kết dữ liệu hai chiều với biến <code>tabIndex</code> để theo dõi tab đang được chọn, kích hoạt sự kiện <code>onChangeTab</code> để tải lại dữ liệu tương ứng.</li>
        <li><code>v-virtual-scroll</code> (Dòng 11-26): Chỉ render các phần tử hiển thị trong khung nhìn của màn hình giúp giảm tải DOM, tăng tốc độ xử lý khi danh sách bài viết lớn.</li>
        <li><code>post-overview</code> (Dòng 17-25): Component con chịu trách nhiệm vẽ thẻ bài viết, truyền thuộc tính <code>displayed-btns</code> cấu hình các nút hành động (Xóa, Ẩn).</li>
    </ul>

    <h3 class="block-title">Khối lệnh Sinh bài đăng tự động (Dòng 38 - 45 & 139 - 170):</h3>
    <pre>
      <span class="comment">&lt;!-- Tab hiển thị bài viết Đã lưu (Bản nháp) --&gt;</span>
      &lt;v-tabs-window-item :value="PostStatus.Saved"&gt;
        <span class="comment">&lt;!-- Nếu tài khoản đã liên kết với Innkeeper thì hiển thị nút Sinh bài đăng --&gt;</span>
        &lt;v-row v-if="isLinked" class="d-flex justify-end mb-4"&gt;
          &lt;v-btn color="blue" prepend-icon="mdi-note-plus-outline" @click="showDialog = true"&gt;
            Sinh bài đăng
          &lt;/v-btn&gt;
        &lt;/v-row&gt;
        ...
      &lt;/v-tabs-window-item&gt;

  <span class="comment">&lt;!-- Hộp thoại Dialog thu thập thông tin mã tòa nhà để sinh bài đăng --&gt;</span>
  &lt;v-dialog v-model="showDialog" width="auto"&gt;
    &lt;v-card :width="400" prepend-icon="mdi-note-plus-outline" title="Sinh bài đăng" text="Dữ liệu lấy từ trang quản lý đã liên kết"&gt;
      &lt;v-card-item&gt;
        &lt;v-row&gt;
          <span class="comment">&lt;!-- Ô nhập số cho mã tòa nhà (buildingCode) --&gt;</span>
          &lt;v-number-input class="mt-2" variant="outlined" controlVariant="stacked" :min="0" v-model="buildingCode"&gt;&lt;/v-number-input&gt;
        &lt;/v-row&gt;
      &lt;/v-card-item&gt;
      &lt;template v-slot:actions&gt;
        &lt;v-btn :disabled="!buildingCode" class="ms-auto" text="Thực hiện" color="orange-lighten-2" @click="genPostsFromManagement"&gt;&lt;/v-btn&gt;
      &lt;/template&gt;
    &lt;/v-card&gt;
  &lt;/v-dialog&gt;</pre>
    <ul>
        <li><code>v-btn</code> (Dòng 39-44): Nút sinh bài đăng tự động, chỉ hiển thị khi tài khoản có liên kết chủ trọ (<code>isLinked == true</code>). Kích hoạt hộp thoại <code>showDialog = true</code>.</li>
        <li><code>v-number-input</code> (Dòng 148-156): Ràng buộc dữ liệu với <code>buildingCode</code> dùng để truyền tham số sinh dữ liệu bài viết.</li>
    </ul>

    <h2 class="subsection-title">2. File logic chủ trọ: postManagement.js</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỒT NGHIỆP/De Tai 2/project đồ án/Rental-Room/src/views/roomSearch/postManagement/postManagement.js">postManagement.js</a></p>
    <p>Chứa toàn bộ mã nguồn xử lý logic dữ liệu cho màn hình quản lý bài đăng phía chủ trọ.</p>

    <h3 class="block-title">Khai báo cấu trúc dữ liệu và Computed Properties (Dòng 10 - 43):</h3>
    <pre>
<span class="keyword">export const</span> usePostManagement = () => {
  <span class="keyword">const</span> { proxy } = getCurrentInstance();
  <span class="keyword">const</span> store = useRoomPostStore();
  <span class="keyword">const</span> contextStore = useContextStore();
  <span class="keyword">const</span> isLinked = ref(<span class="keyword">false</span>);

  <span class="comment">// Kiểm tra xem tài khoản người dùng hiện tại có mã liên kết chủ trọ hay không</span>
  <span class="keyword">if</span> (contextStore.$state.user.innkeeper_id) {
    isLinked.value = <span class="keyword">true</span>;
  }

  <span class="keyword">const</span> { featureBtns } = usePostOverviewCommon();
  <span class="keyword">const</span> tabIndex = ref(1); <span class="comment">// Tab mặc định hiển thị: Bài đã đăng</span>
  <span class="keyword">const</span> tabVals = { favoritePosts: 5 };
  <span class="keyword">const</span> heightOfList = <span class="string">"calc(100vh - 32px - 48px - 16px)"</span>;
  <span class="keyword">const</span> postDetails = ref([]);

  <span class="comment">// Computed property tự động lọc danh sách bài viết Đã đăng (status = 1)</span>
  <span class="keyword">const</span> postedPosts = computed(() => {
    <span class="keyword">return</span> postDetails.value.filter((x) => x.post_status == 1);
  });

  <span class="comment">// Computed property tự động lọc danh sách bài viết Đã lưu/Nháp (status = 0)</span>
  <span class="keyword">const</span> savedPosts = computed(() => {
    <span class="keyword">return</span> postDetails.value.filter((x) => x.post_status == 0);
  });

  <span class="comment">// Computed property tự động lọc danh sách bài viết Chờ duyệt (status = 2)</span>
  <span class="keyword">const</span> waitingPosts = computed(() => {
    <span class="keyword">return</span> postDetails.value.filter(
      (x) => x.post_status === PostStatus.WaitingForApproval
    );
  });</pre>
    <ul>
        <li><code>postedPosts</code>, <code>savedPosts</code>, <code>waitingPosts</code> (Dòng 30-42): Các thuộc tính tính toán tự động cập nhật lại giao diện bất cứ khi nào mảng dữ liệu gốc <code>postDetails</code> thay đổi. Điều này giúp tối ưu hóa bộ nhớ và hiệu năng xử lý vì chỉ cần tải toàn bộ dữ liệu một lần từ Server.</li>
    </ul>

    <h3 class="block-title">Logic Tải Dữ liệu & Điều phối Tab (Dòng 63 - 110):</h3>
    <pre>
  <span class="comment">// Sự kiện thay đổi tab trên giao diện</span>
  <span class="keyword">const</span> onChangeTab = <span class="keyword">async</span> (tabIndex) => {
    <span class="keyword">const</span> me = proxy;
    <span class="comment">// Cập nhật query parameters trên thanh URL nhưng không lưu lại lịch sử di chuyển (replace: true)</span>
    me.$router.push({ query: { tab: tabIndex }, replace: <span class="keyword">true</span> });
    <span class="keyword">await</span> loadData();
  };

  <span class="comment">// Hàm tải dữ liệu chính thức từ API</span>
  <span class="keyword">const</span> loadData = <span class="keyword">async</span> () => {
    <span class="keyword">const</span> me = proxy;
    <span class="keyword">const</span> { user } = contextStore.$state;

    <span class="keyword">if</span> (user?.user_id) {
      <span class="comment">// Nếu là Tab yêu thích thì gọi API riêng để lấy danh sách yêu thích</span>
      <span class="keyword">if</span> (tabIndex.value == tabVals.favoritePosts) {
        <span class="keyword">if</span> (!favoritePosts.value.length) {
          me.loading = <span class="keyword">true</span>;
          <span class="keyword">try</span> {
            <span class="keyword">const</span> res = <span class="keyword">await</span> store.getMyFavoritePosts(user.user_id);
            <span class="keyword">if</span> (Array.isArray(res) && res.length) {
              favoritePosts.value = res;
            }
          } <span class="keyword">catch</span> (error) {
            console.error(error);
          } <span class="keyword">finally</span> {
            me.loading = <span class="keyword">false</span>;
          }
        }
      } <span class="keyword">else</span> {
        <span class="comment">// Các tab nghiệp vụ chung: tải toàn bộ bài viết của người dùng hiện tại</span>
        me.loading = <span class="keyword">true</span>;
        <span class="keyword">try</span> {
          <span class="keyword">var</span> res = <span class="keyword">await</span> store.getMyPosts(user.user_id);
          <span class="keyword">if</span> (Array.isArray(res)) {
            postDetails.value = res;
          }
        } <span class="keyword">catch</span> (error) {
          console.error(error);
        } <span class="keyword">finally</span> {
          me.loading = <span class="keyword">false</span>;
        }
      }
    }
  };</pre>
    <ul>
        <li><code>onChangeTab</code> (Dòng 63-70): Đồng bộ hóa trạng thái tab hiện tại lên URL của trình duyệt, giúp người dùng F5 tải lại trang vẫn giữ đúng tab cũ.</li>
        <li><code>loadData</code> (Dòng 72-110): Rẽ nhánh nghiệp vụ tải dữ liệu. Tab yêu thích gọi <code>getMyFavoritePosts</code> còn các tab khác gọi <code>getMyPosts</code>.</li>
    </ul>

    <h2 class="subsection-title">3. File giao diện duyệt bài: PostApproval.vue</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rental-Room/src/views/admin/PostApproval.vue">PostApproval.vue</a></p>
    <p>Giao diện phục vụ vai trò Admin duyệt bài. Cho phép hiển thị danh sách bài đăng chờ duyệt kèm theo tính năng phân trang đầu cuối.</p>

    <h3 class="block-title">Khối lệnh Template hiển thị danh sách duyệt bài và phân trang (Dòng 9 - 68):</h3>
    <pre>
    <span class="comment">&lt;!-- Danh sách cuộn ảo hiển thị thông tin bài viết cần phê duyệt --&gt;</span>
    &lt;v-virtual-scroll v-if="postDetails.length" ref="virtualScroll" :items="postDetails" :height="heightOfList"&gt;
      &lt;template #default="{ item }"&gt;
        &lt;post-overview
          :key="item.room_post_id"
          :item="item"
          :isShowLikeIcon="false"
          detailPageName="PostDetailApproval" <span class="comment">&lt;!-- Trang chi tiết duyệt bài dành cho Admin --&gt;</span>
          @onClickItem="scrollToIndex(item.sort_order)"
        /&gt;
      &lt;/template&gt;
    &lt;/v-virtual-scroll&gt;
    
    <span class="comment">&lt;!-- Vùng hiển thị thanh phân trang Vuetify --&gt;</span>
    &lt;v-row v-if="postDetails.length" class="d-flex align-center"&gt;
      &lt;v-col&gt;
        &lt;div class="text-h6"&gt;Tổng {{ totalCount ?? 0 }} kết quả&lt;/div&gt;
      &lt;/v-col&gt;
      &lt;v-col cols="2" class="d-flex align-center mr-4"&gt;
        &lt;v-select label="Số bài mỗi trang" density="compact" :items="[10, 20, 50]" v-model="pageSize" @update:modelValue="changePage(1)"&gt;&lt;/v-select&gt;
      &lt;/v-col&gt;
      &lt;v-col cols="6"&gt;
        &lt;v-pagination v-model="pageIndex" :length="pageTotal" :total-visible="5" :showFirstLastPage="true" @update:modelValue="changePage"&gt;
          ...
        &lt;/v-pagination&gt;
      &lt;/v-col&gt;
    &lt;/v-row&gt;</pre>

    <h3 class="block-title">Khối lệnh Script xử lý tải trang bất đồng bộ (Dòng 113 - 152):</h3>
    <pre>
    <span class="keyword">const</span> changePage = <span class="keyword">async</span> (pageIndex, isFirstLoad = <span class="keyword">false</span>) => {
      <span class="keyword">const</span> me = proxy;
      <span class="comment">// Cấu trúc payload phân trang kèm bộ lọc post_status = 2 (Chờ duyệt)</span>
      <span class="keyword">const</span> payload = {
        PagingItem: {
          Skip: (pageIndex - 1) * pageSize.value,
          Take: pageSize.value,
          filters: [
            {
              Field: <span class="string">"post_status"</span>,
              Operator: FilterOperator.Equal,
              Value: PostStatus.WaitingForApproval,
            },
          ],
        },
      };
      
      <span class="comment">// Gọi store thực thi lấy danh sách phân trang nâng cao từ API</span>
      <span class="keyword">const</span> res = <span class="keyword">await</span> roomPostStore.getPaging(payload);

      <span class="keyword">if</span> (Array.isArray(res.data)) {
        postDetails.value = res.data.map((x, index) => ({
          ...x,
          sort_order: index, <span class="comment">// Đánh chỉ số thứ tự phục vụ cơ chế cuộn mượt</span>
        }));
      }

      <span class="keyword">if</span> (<span class="keyword">typeof</span> res.totalCount === <span class="string">"number"</span>) {
        totalCount.value = res.totalCount;
      }
      ...
    };</pre>
    <ul>
        <li><code>changePage</code> (Dòng 113-152): Hàm cốt lõi chịu trách nhiệm tính toán vị trí bản ghi cần lấy (<code>Skip = (pageIndex - 1) * pageSize</code>) và gửi request phân trang lên Server. Bộ lọc tĩnh được truyền kèm đảm bảo Admin chỉ tải danh sách các bài đăng chưa được phê duyệt.</li>
    </ul>

    <!-- PHẦN 3 -->
    <h1 class="section-title">PHẦN 3: GIẢI THÍCH CHI TIẾT CÁC FILE XỬ LÝ LOGIC PHÍA BE (C#)</h1>
    <p>Phần này tập trung phân tích các file mã nguồn Backend chịu trách nhiệm nhận API, xử lý nghiệp vụ lưu trữ đặc điểm và truy vấn Database MySQL cho thực thể bài đăng phòng trọ.</p>

    <h2 class="subsection-title">1. Lớp điều phối API: RoomPostsController.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.API/Controllers/RoomSearch/RoomPostsController.cs">RoomPostsController.cs</a></p>
    <p>Tiếp nhận các yêu cầu HTTP từ client. Kế thừa toàn bộ các API thêm, sửa, xóa cơ bản từ lớp cha dùng chung <code>BasesController</code>.</p>

    <h3 class="block-title">Khai báo cấu trúc lớp và API Yêu thích (Dòng 10 - 41):</h3>
    <pre>
<span class="keyword">namespace</span> RentRoomManagement.API.Controllers.RoomSearch
{
    <span class="keyword">public class</span> <span class="type">RoomPostsController</span> : <span class="type">BasesController</span>&lt;<span class="type">RoomPostDtoEdit</span>, <span class="type">RoomPostDtoClient</span>&gt;
    {
        <span class="keyword">private</span> <span class="type">IRoomPostBL</span> _roomPostBL;

        <span class="keyword">public</span> RoomPostsController(<span class="type">IRoomPostBL</span> roomPostBL) : <span class="keyword">base</span>(roomPostBL)
        {
            _roomPostBL = roomPostBL;
        }

        <span class="comment">/// &lt;summary&gt;</span>
        <span class="comment">/// API Thêm/Bỏ yêu thích một bài viết</span>
        <span class="comment">/// &lt;/summary&gt;</span>
        [Authorize] <span class="comment">// Yêu cầu đính kèm token JWT</span>
        [HttpPost(<span class="string">"favorite-post"</span>)]
        <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">IActionResult</span>&gt; LovePost([FromBody] <span class="type">FavoritePostParam</span> param)
        {
            <span class="keyword">var</span> result = <span class="keyword">await</span> _roomPostBL.LovePost(param);
            <span class="keyword">return</span> StatusCode(StatusCodes.Status200OK, result);
        }
        ...
    }</pre>
    <ul>
        <li><code>RoomPostsController</code> (Dòng 12): Kế thừa từ <code>BasesController&lt;RoomPostDtoEdit, RoomPostDtoClient&gt;</code>, tự động được cung cấp các API RESTful CRUD cơ bản mà không cần viết lại mã nguồn.</li>
    </ul>

    <h3 class="block-title">API Lọc danh sách bài đăng nâng cao (Dòng 57 - 97):</h3>
    <pre>
        <span class="comment">/// &lt;summary&gt;</span>
        <span class="comment">/// API Phân trang nâng cao kết hợp bộ lọc đặc điểm động</span>
        <span class="comment">/// &lt;/summary&gt;</span>
        [HttpPost(<span class="string">"filter-list"</span>)]
        <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">IActionResult</span>&gt; GetPagingCustom([FromBody] <span class="type">RoomFilterParam</span> param)
        {
            <span class="keyword">try</span>
            {
                <span class="comment">// Đảm bảo tham số không bị null để tránh lỗi NullReferenceException</span>
                <span class="keyword">if</span> (param == null)
                {
                    param = <span class="keyword">new</span> <span class="type">RoomFilterParam</span>()
                    {
                        PagingItem = <span class="keyword">new</span> <span class="type">DictionaryPagingItem</span>(),
                        FilterVals = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="keyword">int</span>&gt;()
                    };
                }

                <span class="keyword">var</span> result = <span class="keyword">await</span> _roomPostBL.GetPagingCustom(param);
                <span class="keyword">if</span> (result != null)
                    <span class="keyword">return</span> StatusCode(StatusCodes.Status200OK, result);
                    
                <span class="keyword">return</span> StatusCode(StatusCodes.Status404NotFound, <span class="keyword">new</span> <span class="type">ErrorResult</span>
                {
                    ErrorCode = (int)<span class="type">ErrorCode</span>.NotFound,
                    DevMsg = <span class="type">Errors</span>.DevMsg_Not_Found,
                    UserMsg = <span class="type">Errors</span>.UserMsg_Not_Found,
                });
            }
            <span class="keyword">catch</span> (<span class="type">Exception</span> ex)
            {
                Console.WriteLine(ex.ToString()); <span class="comment">// Ghi log phục vụ kiểm lỗi</span>
                <span class="keyword">return</span> StatusCode(StatusCodes.Status500InternalServerError, <span class="keyword">new</span> <span class="type">ErrorResult</span>
                {
                    ErrorCode = (int)<span class="type">ErrorCode</span>.Exception,
                    DevMsg = <span class="type">Errors</span>.DevMsg_Exception,
                    UserMsg = <span class="type">Errors</span>.UserMsg_Exception,
                    MoreInfo = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="keyword">string</span>&gt; { ex.ToString() },
                });
            }
        }</pre>
    <ul>
        <li><code>GetPagingCustom</code> (Dòng 58-97): API phân trang và lọc nâng cao tùy chỉnh. Nó có cơ chế bắt ngoại lệ (Try-Catch) chặt chẽ, tự động chuyển đổi thông tin Exception chi tiết thành thuộc tính <code>MoreInfo</code> giúp các lập trình viên Frontend dễ dàng debug lỗi.</li>
    </ul>

    <h2 class="subsection-title">2. Lớp nghiệp vụ: RoomPostBL.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.BL/Tenant/RoomSearch/RoomPostBL.cs">RoomPostBL.cs</a></p>
    <p>Chứa các quy tắc nghiệp vụ liên quan đến việc xử lý dữ liệu đặc điểm của bài viết sau khi được lưu thành công.</p>

    <h3 class="block-title">Thuật toán Hậu xử lý lưu đặc điểm phòng trọ (Dòng 83 - 120):</h3>
    <pre>
        <span class="comment">/// &lt;summary&gt;</span>
        <span class="comment">/// Kích hoạt tự động sau khi bản ghi bài đăng được chèn thành công vào CSDL</span>
        <span class="comment">/// &lt;/summary&gt;</span>
        <span class="keyword">protected override async</span> <span class="type">Task</span> AfterInsertSync(<span class="type">RoomPostDtoClient</span> entity)
        {
            <span class="comment">// Nếu không có thông tin đặc điểm phòng trọ thì bỏ qua</span>
            <span class="keyword">if</span> (entity.room_characteristic == null)
            {
                <span class="keyword">return</span>;
            }

            <span class="comment">// Giải mã chuỗi JSON mảng lưu trữ đặc điểm (ví dụ "[1, 3, 5]") thành danh sách số nguyên</span>
            <span class="keyword">var</span> roomCharacteristic = <span class="type">JsonConvert</span>.DeserializeObject&lt;<span class="type">List</span>&lt;<span class="keyword">int</span>&gt;&gt;(entity.room_characteristic);
            <span class="keyword">if</span> (roomCharacteristic != null && roomCharacteristic.Any())
            {
                <span class="keyword">foreach</span> (<span class="keyword">var</span> item <span class="keyword">in</span> roomCharacteristic)
                {
                    <span class="keyword">try</span>
                    {
                        <span class="comment">// Ánh xạ đặc điểm thành thực thể RoomFilterEntity để chèn vào bảng CSDL phụ trợ</span>
                        <span class="keyword">var</span> roomFilter = <span class="keyword">new</span> <span class="type">RoomFilterEntity</span>()
                        {
                            room_post_id = entity.room_post_id,
                            filter_value = item
                        };

                        <span class="comment">// Gọi phương thức InsertAsync dùng chung từ lớp cha BaseBL</span>
                        _ = <span class="keyword">await</span> InsertAsync(roomFilter);
                    }
                    <span class="keyword">catch</span> (<span class="type">Exception</span> ex) { }
                }
            }
        }</pre>
    <ul>
        <li><code>AfterInsertSync</code> (Dòng 83-120): Phương thức ghi đè (override) từ lớp cha. Nó áp dụng thư viện <code>Newtonsoft.Json</code> để bóc tách mảng đặc điểm phòng trọ, thực hiện chèn dữ liệu bất đồng bộ vào bảng lọc hỗ trợ tìm kiếm nhanh mà không gây tắc nghẽn luồng xử lý chính.</li>
    </ul>

    <h3 class="block-title">Thuật toán Lọc nâng cao kết hợp phân trang (Dòng 127 - 161):</h3>
    <pre>
        <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">PagingResult</span>&gt; GetPagingCustom(<span class="type">RoomFilterParam</span> param)
        {
            <span class="keyword">var</span> pagingItem = param.PagingItem ?? <span class="keyword">new</span> <span class="type">DictionaryPagingItem</span>();
            <span class="keyword">var</span> roomPostIDs = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="type">Guid</span>&gt;();

            <span class="comment">// Nếu có truyền danh sách đặc điểm cần lọc từ Client</span>
            <span class="keyword">if</span> (param.FilterVals != null && param.FilterVals.Count &gt; 0)
            {
                <span class="comment">// Bước 1: Gọi DL truy vấn lấy danh sách các RoomPostID thỏa mãn đặc điểm</span>
                roomPostIDs = <span class="keyword">await</span> _roomPostDL.FilterByCharacteristic(param.FilterVals);
                <span class="keyword">if</span> (roomPostIDs.Any())
                {
                    <span class="keyword">var</span> filterList = pagingItem.Filters ?? <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="type">FilterItem</span>&gt;();
                    <span class="comment">// Bước 2: Ép thêm điều kiện SQL động "room_post_id IN (@roomPostIDs)" vào cấu trúc bộ lọc dùng chung</span>
                    filterList.Add(<span class="keyword">new</span> <span class="type">FilterItem</span>()
                    {
                        Field = nameof(<span class="type">RoomPostEntity</span>.room_post_id),
                        Operator = <span class="type">FilterOperator</span>.IN,
                        Value = roomPostIDs
                    });

                    pagingItem.Filters = filterList;
                }
                <span class="keyword">else</span>
                {
                    <span class="comment">// Trả về rỗng ngay nếu không có bài viết nào khớp đặc điểm để tránh truy vấn thừa</span>
                    <span class="keyword">return</span> <span class="keyword">new</span> <span class="type">PagingResult</span>()
                    {
                        Data = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="type">RoomPostDtoClient</span>&gt;(),
                        TotalCount = 0,
                    };
                }
            }

            <span class="comment">// Bước 3: Gọi hàm phân trang của lớp cha BaseBL để hoàn tất câu truy vấn</span>
            <span class="keyword">var</span> pagingResult = <span class="keyword">await</span> <span class="keyword">base</span>.GetPaging(pagingItem);
            <span class="keyword">return</span> pagingResult;
        }</pre>

    <h2 class="subsection-title">3. Lớp truy cập cơ sở dữ liệu: RoomPostDL.cs</h2>
    <p class="no-indent">Nằm tại file: <a href="file:///d:/ĐỒ ÁN TỐT NGHIỆP/De Tai 2/project đồ án/Rent_Room_Management-BE/RentRoomManagement.DL/RoomSearch/RoomPostDL.cs">RoomPostDL.cs</a></p>
    <p>Thực thi truy vấn dữ liệu thô bằng Dapper hoặc ADO.NET trực tiếp tới CSDL MySQL.</p>

    <h3 class="block-title">Thuật toán tìm kiếm động đặc điểm phòng trọ JSON (Dòng 78 - 115):</h3>
    <pre>
        <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="type">List</span>&lt;<span class="type">Guid</span>&gt;&gt; FilterByCharacteristic(<span class="type">List</span>&lt;<span class="keyword">int</span>&gt; filterVals)
        {
            <span class="keyword">var</span> selectedFilterVals = filterVals.Distinct().ToList(); <span class="comment">// Loại bỏ trùng lặp</span>
            <span class="keyword">if</span> (!selectedFilterVals.Any())
            {
                <span class="keyword">return new</span> <span class="type">List</span>&lt;<span class="type">Guid</span>&gt;();
            }

            <span class="keyword">using</span> (<span class="keyword">var</span> connection = <span class="keyword">new</span> <span class="type">MySqlConnection</span>(<span class="type">DatabaseContext</span>.ConnectionString))
            {
                <span class="keyword">await</span> connection.OpenAsync();

                <span class="keyword">var</span> tableName = <span class="type">BuildQuery</span>.TableNameMapper&lt;<span class="type">RoomPostEntity</span>&gt;();
                <span class="keyword">var</span> whereParts = <span class="keyword">new</span> <span class="type">List</span>&lt;<span class="keyword">string</span>&gt;
                {
                    <span class="comment">// Chỉ tìm kiếm các bản ghi có dữ liệu đặc điểm hợp lệ</span>
                    $<span class="string">"{nameof(RoomPostEntity.room_characteristic)} IS NOT NULL"</span>,
                    $<span class="string">"JSON_VALID({nameof(RoomPostEntity.room_characteristic)})"</span>
                };

                <span class="keyword">var</span> param = <span class="keyword">new</span> <span class="type">DynamicParameters</span>();
                <span class="comment">// Tạo mệnh đề JSON_CONTAINS động cho từng đặc điểm để tìm kiếm chính xác trong mảng JSON</span>
                <span class="keyword">for</span> (<span class="keyword">int</span> i = 0; i &lt; selectedFilterVals.Count; i++)
                {
                    <span class="keyword">var</span> paramName = $<span class="string">"filterVal{i}"</span>;
                    whereParts.Add(
                        $<span class="string">"JSON_CONTAINS({nameof(RoomPostEntity.room_characteristic)}, @{paramName}, '$')"</span>
                    );
                    param.Add(paramName, selectedFilterVals[i].ToString());
                }

                <span class="keyword">var</span> sql = $@"
                    SELECT {nameof(<span class="type">RoomPostEntity</span>.room_post_id)}
                    FROM {tableName}
                    WHERE {string.Join(" AND ", whereParts)}";

                <span class="keyword">var</span> items = <span class="keyword">await</span> connection.QueryAsync&lt;<span class="type">Guid</span>&gt;(sql, param);
                <span class="keyword">return</span> items.ToList();
            }
        }</pre>
    <ul>
        <li><code>JSON_CONTAINS</code> (Dòng 102): Hàm đặc thù của MySQL cho phép kiểm tra xem một giá trị cụ thể có nằm trong trường dữ liệu định dạng JSON hay không. Việc sử dụng hàm này trực tiếp giúp tăng tốc độ xử lý mà không cần bóc tách dữ liệu phức tạp trên bộ nhớ RAM.</li>
    </ul>

    <h3 class="block-title">Thuật toán Cập nhật Trạng thái bài đăng & Ngày đăng (Dòng 232 - 252):</h3>
    <pre>
        <span class="keyword">public async</span> <span class="type">Task</span>&lt;<span class="keyword">int</span>&gt; UpdatePostStatus(<span class="type">PostStatusUpdatingParam</span> param)
        {
            <span class="keyword">using</span> (<span class="keyword">var</span> connection = <span class="keyword">new</span> <span class="type">MySqlConnection</span>(<span class="type">DatabaseContext</span>.ConnectionString))
            {
                <span class="keyword">await</span> connection.OpenAsync();

                <span class="keyword">var</span> tableName = <span class="type">BuildQuery</span>.TableNameMapper&lt;<span class="type">RoomPostEntity</span>&gt;();
                <span class="comment">// Câu truy vấn SQL cập nhật trạng thái bài đăng. </span>
                <span class="comment">// Nếu postStatus truyền vào là 1 (Đã đăng/Đã duyệt), cập nhật posted_date bằng thời gian hiện tại (NOW())</span>
                <span class="keyword">var</span> sql = $<span class="string">"UPDATE {tableName} SET "</span> +
                    $<span class="string">"{nameof(RoomPostEntity.post_status)} = @postStatus, "</span> +
                    $<span class="string">"{nameof(RoomPostEntity.posted_date)} = CASE WHEN @postStatus = 1 THEN NOW() ELSE {nameof(RoomPostEntity.posted_date)} END, "</span> +
                    $<span class="string">"{nameof(RoomPostEntity.reject_message)} = @rejectMessage "</span> +
                    $<span class="string">"WHERE {nameof(RoomPostEntity.room_post_id)} = @roomPostId"</span>;

                <span class="keyword">return await</span> connection.ExecuteAsync(sql, <span class="keyword">new</span>
                {
                    postStatus = param.PostStatus,
                    rejectMessage = param.RejectMessage,
                    roomPostId = param.RoomPostId
                });
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
            <br><em>Chức năng:</em> Thuật toán chuẩn hóa bộ lọc. Nhận bộ lọc từ client, truy vấn metadata hệ thống <code>INFORMATION_SCHEMA.COLUMNS</code> của MySQL để lấy danh sách cột thực tế, loại bỏ hoặc ánh xạ lại các cột không khớp để tránh lỗi câu lệnh SQL. Đặc biệt, nếu lọc theo trường địa điểm (province_id, district_id, ward_id), thuật toán tự động chuyển đổi chúng thành câu lệnh truy vấn con <code>IN (SELECT room_post_id FROM room_post_location WHERE ...)</code> giúp tách biệt dữ liệu địa lý ra một bảng riêng để tối ưu hóa hiệu năng lưu trữ và truy vấn.
        </li>
        <li><strong>Dòng 241 - 299 [Hàm GetPaging]:</strong> 
            <br><em>Chức năng:</em> Sử dụng Dapper để build câu lệnh SQL phân trang động dựa trên bộ lọc đã chuẩn hóa. Điểm thông minh ở đây là câu lệnh sẽ tự động cấu hình vô hiệu hóa chế độ nghiêm ngặt <code>ONLY_FULL_GROUP_BY</code> ở cấp session MySQL trước khi chạy để tránh lỗi truy vấn nhóm cột cũ, đồng thời thực thi lấy danh sách phân trang và đếm tổng số lượng bản ghi để trả về cho Client.
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
$word.DisplayAlerts = 0
try {
    $htmlPath = Join-Path (Get-Location).Path "quan_ly_bai_dang.html"
    $docxPath = Join-Path (Get-Location).Path "quan ly bai dang.docx"
    
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
const tempPsScriptPath = path.join(outputDir, 'convert_post.ps1');
fs.writeFileSync(tempPsScriptPath, psCommand, 'utf8');

console.log('Đang chạy PowerShell script để tạo file DOCX...');
try {
    // Chạy lệnh powershell từ thư mục làm việc là outputDir để bảo đảm relative paths hoạt động đúng
    const output = execSync('powershell -ExecutionPolicy Bypass -File "convert_post.ps1"', { 
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
