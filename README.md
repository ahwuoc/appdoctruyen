# 📚 AppDocTruyen

Một ứng dụng đọc truyện trực tuyến hiện đại được xây dựng bằng **Next.js**, **Supabase**, và **Bun** để mang lại hiệu suất vượt trội và trải nghiệm người dùng mượt mà. 🚀  

## 🌟 Tính năng  

✅ **Trải nghiệm đọc mượt mà** – Tận hưởng giao diện người dùng được thiết kế đẹp mắt, tối ưu cho việc đọc truyện.  
✅ **Quản lý truyện** – Dễ dàng quản lý truyện với Supabase (Xác thực, Cơ sở dữ liệu, và Lưu trữ).  
✅ **Tìm kiếm & Phân loại nâng cao** – Nhanh chóng tìm kiếm truyện với các tính năng lọc và tìm kiếm mạnh mẽ.  
✅ **Hỗ trợ Yêu thích & Đánh dấu** – Đánh dấu các truyện yêu thích để truy cập dễ dàng.  
✅ **Hiệu suất vượt trội** – Được hỗ trợ bởi Bun, nhanh hơn đáng kể so với các thiết lập Node.js truyền thống.  

---  

## 🔧 Cài đặt & Thiết lập  

### **1️⃣ Sao chép kho lưu trữ**  
```bash
git clone https://github.com/anhquoc1k98/appdoctruyen.git
cd appdoctruyen
```

### **2️⃣ Cài đặt các thư viện phụ thuộc**  
```bash
bun install
npm install -g bun
```

### **3️⃣ Cấu hình biến môi trường**  
Tạo tệp `.env.local` trong thư mục gốc và thêm thông tin xác thực Supabase của bạn:  
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key