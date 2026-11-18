# Việt Trung – ứng dụng dịch tiếng Việt sang Trung phồn thể

Đây là bản khởi đầu dạng **PWA**: có thể cài lên màn hình chính Android và mở gần giống ứng dụng. Bạn chỉ cần điện thoại và trình duyệt Chrome. Bản này chưa phải APK độc lập; có thể đóng gói APK ở giai đoạn sau.

## Phần A — Đưa giao diện lên mạng bằng GitHub Pages

1. Tạo tài khoản GitHub nếu chưa có: https://github.com/
2. Trong Chrome trên điện thoại, mở GitHub và tạo repository mới, ví dụ `viet-trung`.
3. Tải các file trong thư mục này lên repository (Add file → Upload files).
4. Vào Settings → Pages → chọn Deploy from a branch → branch `main`, folder `/root` → Save.
5. Chờ GitHub Pages xuất bản trang. Bạn sẽ có địa chỉ dạng `https://TEN-TK.github.io/viet-trung/`.

## Phần B — Tạo máy chủ dịch an toàn bằng Cloudflare Workers

Không đặt API key trong `app.js` hoặc bất kỳ file giao diện công khai nào.

1. Tạo tài khoản Cloudflare: https://dash.cloudflare.com/
2. Mở Workers & Pages → Create → Worker → Deploy.
3. Mở Edit code, thay nội dung bằng file `worker.js` trong gói này, rồi Deploy.
4. Trong phần Worker Settings → Variables and Secrets, thêm secret:
   - Name: `OPENAI_API_KEY`
   - Value: API key của bạn lấy từ https://platform.openai.com/api-keys
5. Lưu secret và deploy lại nếu Cloudflare yêu cầu.
6. Sao chép URL Worker, thường có dạng `https://ten-worker.ten-tai-khoan.workers.dev`.

## Phần C — Kết nối giao diện với máy chủ

1. Mở file `app.js` trong repository GitHub.
2. Tìm dòng:
   `const API_ENDPOINT = "PASTE_YOUR_WORKER_URL_HERE";`
3. Thay phần trong dấu ngoặc kép bằng URL Worker của bạn.
4. Lưu thay đổi và chờ GitHub Pages cập nhật.

## Phần D — Cài lên Android

1. Mở URL GitHub Pages bằng Chrome trên Android.
2. Chọn menu ⋮ → Install app (hoặc Add to Home screen).
3. Xác nhận cài đặt. Biểu tượng Việt Trung sẽ xuất hiện trên màn hình chính.

## Lưu ý chi phí và bảo mật

- ChatGPT Plus/Free và API là hai hệ thống thanh toán riêng. API có thể phát sinh phí theo mức sử dụng; kiểm tra giá và đặt giới hạn ngân sách tại OpenAI Platform.
- Không chia sẻ API key cho người khác. Secret chỉ được lưu ở Cloudflare Worker.
- Worker mẫu đang cho phép gọi từ mọi website (`Access-Control-Allow-Origin: *`). Khi dùng riêng ổn định, nên giới hạn origin về đúng địa chỉ GitHub Pages của bạn.
- Không đưa thông tin nhạy cảm vào nội dung dịch.
- Đây là bộ khung học tập ban đầu, chưa có đăng nhập, giới hạn người dùng hay chống lạm dụng nâng cao.
