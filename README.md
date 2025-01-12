# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

# Set up

## Vite.config.js

resolve: {
alias: {
"@": path.resolve(\_\_dirname, "./src"),
},
},

## Install

npm install vue-router@4
npm i moment
npm install pinia (Manage vue state)
npm install -D sass vite-plugin-vue (SCSS)
npm create vuetify@latest (Framework UI)
npm i @fullcalendar/core @fullcalendar/vue3 @fullcalendar/daygrid @fullcalendar/interaction @fullcalendar/bootstrap5 bootstrap bootstrap-icons

## Libraries

[Vuelidate](https://vuelidate-next.netlify.app/)
[FullCalendar](https://github.com/fullcalendar/fullcalendar-examples/tree/main/vue3/)
[VueCurrencyInput](https://dm4t2.github.io/vue-currency-input/guide.html)

# NOTE

## If you are using vite then require will not work; it's webpack-only

## Các kỹ thuật tối ưu vuejs

### Tối ưu tốc độ tải trang

1. Code Splitting và Lazy loading components
2. Sử dụng keep-alive để cache components
3. Import từng phần của node module cần dùng (Tree-shaking)
4. Bundle và Minify resource

### Tối ưu code trong Vue

1. Sử dụng v-if thay vì v-show
2. Tránh sử dụng v-for và v-if trên cùng một phần tử
3. Chú ý khi sử dụng Watch

- Sử dụng Watch với `deep:true` để quan sát các đối tượng lồng nhau hoặc mảng có thể gây tốn hiệu năng => Chỉ dùng khi thật sự cần
- Nếu chỉ cần theo dõi 1 thuộc tính của 1 đối tượng thì chỉ cần theo dõi thuộc tính đó (Ex: watch: { `user.name`: () => {} })

4. Chú ý khi sử dụng computed

- Không tính toán phức tạp trong computed
- Chỉ nên thực hiện phép tính thuần túy và trả về, không nên làm các việc khác (Cập nhật, ...)
- Không thay đổi giá trị computed đã được tính toán => Đảm bảo tính nhất quán

### Tối ưu hóa code js

1. Sử dụng Debounce và Throttle
2. Giảm Thiểu Số Lần Truy Cập và Thay Đổi DOM

- DocumentFragment: Sử dụng `DocumentFragment` để
  tạo và thay đổi các phần tử DOM trước khi thêm chúng
  vào DOM thật. Điều này giúp giảm số lần truy cập và thay
  đổi trực tiếp trên DOM thật.

- Caching DOM Elements: Lưu trữ các phần tử DOM cần
  truy cập nhiều lần vào biến để tránh truy cập lại DOM
  nhiều lần.

3. Tối ưu vòng lặp

- Giảm thiểu điều kiện tính toán không cần thiết trong vòng lặp

4. Tối ưu Asynchronous Code

- Tối ưu khi sử Dụng `async`/`await` trong vòng lặp: Hạn chế dùng await trực tiếp trong LOOP nếu kết
  quả trong vòng lặp không phụ thuộc vào nhau => Thay vào đó, thu thập tất cả các promises trước và đợi chúng song song
  (Promise.all(promies))

### Tối ưu request API

1. Cache dữ liệu trên Client
2. Load On-Demand

- Sử dụng Tab: Chỉ load dữ liệu khi click vào tab, khi chuyển sang tab khác quay lại tab đã click thì không load
  lại dữ liệu nữa.
- Sử dụng Combobox: Với các form nhập liệu có Combobox cần lấy dữ liệu từ Server thì chỉ nên load dữ liệu
  Combobox khi xổ combo ra.
- Màn hình nhiều view có scroll kéo xuống để xem các view bên dưới (Ví dụ Dashboard): Chỉ lấy dữ liệu cho các
  view nhìn thấy ở trên màn hình, khi scroll xuống dưới thì mới load tiếp dữ liệu cho view bên dưới.

3. Sử dụng Paging Data

- Bao gồm (> or < 100 bản ghi): Paging Server, Paging Local
- Danh sách dạng Grid: dùng thanh toolbar paging
- Combobox: sử dụng Virtual Scroll (scroll đến cuối trang mới load data), không cần kiểm tra TotalCount
  (tổng số dòng dữ liệu có ở Server), chỉ cần xác định PageSize (Số bản ghi cần lấy trên 1 trang) để kiểm
  tra nếu dữ liệu lấy về < PageSize thì không cần gọi API lấy dữ liệu nữa
- Danh sách dạng cây (Tree): Có một số cách như sau:
  ○ Sử dụng Virtual Scroll để phân trang và có thể kết hợp với Virtual Render để xử lý chỉ render những item
  đang được hiển thị để tối ưu hiệu năng render, tránh tốn Memory trình duyệt
  ○ Sử dụng Lazy Load theo node cha: chỉ load dữ liệu node cha trước, khi mở rộng (expand) node cha thì mới
  load dữ liệu các node con.
  ○ Tối ưu render ít cấp nhất có thể: danh sách dạng cây thường dữ liệu có nhiều cấp, để tối ưu thời gian
  render thì có thể chỉ render 1 hoặc 2 cấp, khi expand node thì mới render cấp tiếp theo.


## Viet Nam Location APIs
https://provinces.open-api.vn/api/?depth=3

## Sign In
https://console.firebase.google.com/
https://developers.facebook.com/