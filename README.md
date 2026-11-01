# Birthday Parade React

Trải nghiệm sinh nhật hoạt hình 2D sáu scene, chuyển sang React theo kiến trúc feature-based.

## Chạy local

Chạy npm install rồi npm run dev tại thư mục dự án. Vite sẽ in địa chỉ local trong terminal. Chạy npm run build để tạo bản tĩnh trong dist/.

## Stack

- React và Vite cho giao diện ứng dụng.
- Tailwind CSS v4 cho layout, responsive, typography và spacing.
- Base UI cho primitive Button và Dialog; Button dùng phong cách neobrutalism.
- GSAP và @gsap/react cho chuyển scene, reveal và tương tác.
- CSS riêng dành cho minh họa 2D nhiều lớp và họa tiết.

Cấu trúc nằm trong src/features và src/shared/ui. Luồng gồm Opening, VIP Quest (xúc xắc hoặc hứng 10 sao), Lucky Machine, Cake, Letter và Finale. Link nhận query string to, from, wish; dữ liệu không gửi lên server.

Trang khóa cuộn trên desktop/mobile. Nút scene 2–6 dùng chung điểm neo theo vị trí scene 4. Tôn trọng tùy chọn reduced motion.