# Tổng Quan Dự Án - Minimalist CV

## Dự án này là gì?

Đây là một **website để hiển thị CV/Resume của bạn** theo phong cách tối giản và chuyên nghiệp. Thay vì gửi file PDF cho nhà tuyển dụng, bạn có thể gửi link website này - nó vừa đẹp vừa dễ đọc trên cả điện thoại lẫn máy tính. Và nếu họ muốn in ra, website cũng đã được tối ưu sẵn để in rất đẹp!

## Tại sao nên dùng?

### 1. Cực kỳ đơn giản để chỉnh sửa
- Tất cả thông tin CV của bạn chỉ nằm trong **MỘT file duy nhất**: `src/data/resume-data.tsx`
- Không cần biết code phức tạp, chỉ cần sửa text trong file đó là xong
- Muốn thêm công ty mới? Thêm project mới? Chỉ cần copy-paste và sửa lại thông tin

### 2. Trông rất chuyên nghiệp
- Thiết kế tối giản, sạch sẽ, dễ đọc
- Responsive tốt - đẹp trên mọi kích thước màn hình
- Font chữ được chọn kỹ càng, spacing hợp lý

### 3. Tính năng đặc biệt
- **In ấn hoàn hảo**: Bấm in ra sẽ có bản PDF cực đẹp
- **Phím tắt**: Nhấn `Cmd+K` hoặc `Ctrl+J` để mở menu điều hướng nhanh
- **GraphQL API**: Website còn cung cấp API để các ứng dụng khác có thể lấy thông tin CV của bạn
- **SEO tốt**: Dễ được Google index và hiển thị đẹp khi share lên mạng xã hội

## Công nghệ sử dụng (giải thích đơn giản)

### Next.js 14
Đây là **framework để xây dựng website** bằng React. Hãy nghĩ nó như một bộ công cụ hoàn chỉnh giúp bạn xây nhà - nó lo hết mọi thứ từ móng, tường, mái cho đến điện nước. Bạn chỉ cần trang trí nội thất (thêm nội dung CV).

**Tại sao dùng Next.js?**
- Tự động tối ưu performance (website load nhanh)
- SEO tốt (Google dễ tìm thấy)
- Dễ deploy lên Vercel (host miễn phí)

### TypeScript
Là **phiên bản "an toàn" của JavaScript**. Giống như khi bạn viết code, TypeScript sẽ kiểm tra ngay xem bạn có viết sai gì không, thay vì đợi đến khi chạy mới báo lỗi.

**Ví dụ đơn giản:**
- JavaScript: Bạn có thể ghi "Ban Nguyen" vào ô tuổi và nó không báo lỗi (cho đến khi chạy)
- TypeScript: Nó sẽ báo ngay "Ê, ô tuổi phải là số chứ, không được ghi chữ!"

### Tailwind CSS
Là cách **viết CSS nhanh hơn và dễ quản lý hơn**. Thay vì viết file CSS riêng, bạn viết ngay trong HTML.

**So sánh:**
- **Cách cũ (CSS truyền thống):**
  ```css
  /* file.css */
  .my-button {
    background-color: blue;
    padding: 10px;
    border-radius: 5px;
  }
  ```
  ```html
  <button class="my-button">Click me</button>
  ```

- **Cách mới (Tailwind):**
  ```html
  <button class="bg-blue-500 p-2 rounded">Click me</button>
  ```

Ngắn gọn hơn, nhìn code là biết ngay style, không phải nhảy qua nhảy lại giữa nhiều file!

### shadcn/ui
Là bộ **components UI đẹp sẵn** mà bạn có thể copy-paste vào project. Ví dụ: buttons, cards, dialogs đã được thiết kế đẹp và accessible (người khuyết tật vẫn dùng được).

**Khác biệt với các thư viện khác:**
- Không phải cài package nặng nề
- Copy code vào project, muốn sửa gì sửa
- Full control

### GraphQL & Apollo Server
Là cách để **cung cấp API** cho website. Nếu bạn muốn app khác (ví dụ: app mobile) lấy thông tin CV của bạn, chúng có thể gọi đến `/graphql` endpoint.

**Ví dụ thực tế:**
- Bạn có website CV này
- Bạn xây thêm app mobile
- App mobile cần hiển thị thông tin CV → Gọi GraphQL API → Lấy được data

### Bun
Là **công cụ để quản lý dependencies** (các thư viện bạn dùng) và chạy scripts. Nó giống như npm hay yarn nhưng **nhanh hơn nhiều**.

**So sánh tốc độ:**
- npm install: ~45 giây
- yarn install: ~30 giây
- **bun install: ~5 giây** 🚀

## Cấu trúc project (giải thích đơn giản)

```
minimalist-cv/
├── src/
│   ├── app/                    # Các trang của website
│   │   ├── page.tsx            # Trang chính (trang CV)
│   │   ├── layout.tsx          # Layout chung (header, footer chung cho mọi trang)
│   │   └── graphql/            # API endpoint
│   │
│   ├── components/             # Các "mảnh ghép" tái sử dụng được
│   │   ├── ui/                 # Buttons, Cards, Badges...
│   │   └── icons/              # Icons như GitHub, LinkedIn...
│   │
│   ├── data/                   # ⭐ QUAN TRỌNG - Nơi bạn sửa thông tin CV
│   │   └── resume-data.tsx     # File chứa toàn bộ data CV của bạn
│   │
│   ├── apollo/                 # Cấu hình GraphQL API
│   ├── lib/                    # Các hàm tiện ích
│   └── images/                 # Hình ảnh, logos
│
├── public/                     # Files tĩnh (robots.txt, favicon...)
├── DOCS/                       # Thư mục documentation (file bạn đang đọc)
├── package.json                # Danh sách dependencies
├── bun.lockb                   # Lock file của Bun
├── tailwind.config.js          # Cấu hình Tailwind
├── Dockerfile                  # Để chạy trong Docker container
└── README.md                   # Hướng dẫn cơ bản
```

### Giải thích từng folder quan trọng:

#### 📁 `src/app/`
Đây là **nơi chứa các trang** của website. Next.js 14 dùng "App Router", nghĩa là:
- Mỗi folder = 1 route (đường dẫn URL)
- File `page.tsx` = trang hiển thị
- File `layout.tsx` = khung chung cho nhiều trang

**Ví dụ:**
```
src/app/
  ├── page.tsx           → Hiển thị tại: yourdomain.com/
  └── about/
      └── page.tsx       → Hiển thị tại: yourdomain.com/about
```

#### 📁 `src/components/`
Chứa các **component tái sử dụng được** - giống như Lego blocks, bạn ghép chúng lại để tạo thành trang hoàn chỉnh.

**Ví dụ component:**
```typescript
// Avatar component - hiển thị ảnh đại diện
<Avatar>
  <AvatarImage src="/me.jpg" alt="My Photo" />
  <AvatarFallback>BN</AvatarFallback>  {/* Hiện "BN" nếu ảnh lỗi */}
</Avatar>
```

#### 📁 `src/data/` ⭐ CỰC QUAN TRỌNG
Đây là **nơi bạn sẽ chỉnh sửa nhiều nhất**! File `resume-data.tsx` chứa toàn bộ thông tin của bạn:

```typescript
export const RESUME_DATA = {
  name: "Ban Nguyen",              // Tên của bạn
  initials: "BN",                  // Chữ viết tắt
  location: "Ho Chi Minh City",    // Địa chỉ
  about: "Full Stack Engineer...", // Mô tả ngắn

  work: [                          // Kinh nghiệm làm việc
    {
      company: "99 Tech",
      title: "Senior Software Engineer",
      start: "2021",
      end: "2024",
      description: "Worked on...",
    },
    // Thêm công ty khác...
  ],

  skills: ["React", "TypeScript", "Node.js"],  // Kỹ năng
  projects: [...],                              // Dự án
  education: [...],                             // Học vấn
}
```

Muốn cập nhật CV? Chỉ cần sửa file này!

## Luồng hoạt động (Data Flow)

Hãy tưởng tượng như một **nhà hàng**:

1. **`resume-data.tsx`** = **Kho nguyên liệu** (data)
2. **Components** = **Đầu bếp** (xử lý và trình bày data)
3. **Page** = **Món ăn** (sản phẩm cuối cùng người dùng nhìn thấy)

```
resume-data.tsx (Nguồn gốc)
    ↓
    ├──→ Page.tsx (Trang chính)
    │     ├──→ Header Component (Hiện tên, avatar, contact)
    │     ├──→ WorkExperience Component (Hiện kinh nghiệm)
    │     ├──→ Projects Component (Hiện dự án)
    │     └──→ Skills Component (Hiện kỹ năng)
    │
    └──→ GraphQL API (/graphql endpoint)
          └──→ Ứng dụng khác có thể lấy data qua đây
```

**Ưu điểm của cách này:**
- ✅ Sửa 1 chỗ (resume-data.tsx) → Tất cả nơi khác tự động update
- ✅ Không bao giờ bị data không khớp nhau
- ✅ Dễ maintain, dễ debug

## Tính năng đặc biệt

### 1. Command Menu (Phím tắt)
Nhấn `Cmd+K` (Mac) hoặc `Ctrl+J` (Windows) để mở menu điều hướng nhanh:
- Print resume
- Navigate to sections
- Open social links

**Công nghệ:** Dùng thư viện `cmdk` - giống như Spotlight trên Mac hoặc Command Palette trên VS Code.

### 2. Print Optimization (Tối ưu in ấn)
Website có CSS riêng cho việc in ấn:
- Font size nhỏ hơn để fit 1 trang A4
- Ẩn các nút interactive (không cần thiết khi in)
- Hiện thông tin contact đầy đủ
- Spacing được điều chỉnh

**Ví dụ code:**
```tsx
// Trên màn hình: ẩn
// Khi in: hiện
<div className="hidden print:flex">
  Email: ban@example.com
</div>

// Spacing khác nhau
<section className="space-y-8 print:space-y-4">
  {/* Khoảng cách giữa sections:
      - Màn hình: 8 units (2rem)
      - In: 4 units (1rem) để tiết kiệm giấy
  */}
</section>
```

### 3. Error Boundaries
Website có khả năng **tự phục hồi khi lỗi**:
- Nếu 1 section bị lỗi → Chỉ section đó hiện thông báo lỗi
- Các section khác vẫn hoạt động bình thường
- Có nút "Try again" để retry

**So sánh:**
- ❌ **Không có Error Boundary:** 1 lỗi nhỏ → toàn bộ trang chết trắng
- ✅ **Có Error Boundary:** 1 lỗi nhỏ → chỉ 1 phần bị ảnh hưởng, phần còn lại vẫn OK

### 4. Loading States (Trạng thái loading)
Khi data đang load, hiển thị **skeleton UI** (placeholder animation):
```
┌────────────────┐
│ ▓▓▓▓▓▓        │  ← Animated loading bar
│               │
│ ▓▓▓▓ ▓▓▓▓▓    │
│ ▓▓▓▓▓▓▓       │
└────────────────┘
```

Tốt hơn nhiều so với chỉ hiện "Loading..." hay màn hình trắng!

### 5. SEO & Open Graph
Khi share link CV lên Facebook, Twitter, LinkedIn:
- Hiện ảnh đại diện đẹp
- Hiện tiêu đề, mô tả hấp dẫn
- Google dễ index

**Code:**
```typescript
// src/app/layout.tsx
export const metadata = {
  title: "Ban Nguyen - Full Stack Engineer",
  description: "Experienced full stack engineer...",
  openGraph: {
    images: ["/og-image.png"],  // Ảnh khi share lên MXH
  },
}
```

## Ưu điểm của kiến trúc này

### 1. Single Source of Truth (Nguồn gốc duy nhất)
- Mọi data đều từ 1 file `resume-data.tsx`
- Không bao giờ bị mâu thuẫn data
- Sửa 1 lần, áp dụng mọi nơi

### 2. Type Safety (An toàn kiểu dữ liệu)
TypeScript đảm bảo:
- Không bao giờ thiếu field quan trọng
- Không bao giờ ghi sai kiểu data
- IDE gợi ý code cực tốt

**Ví dụ:**
```typescript
// ❌ Lỗi ngay lập tức - TypeScript báo:
work: [{
  company: "99 Tech",
  // Thiếu field "title" → TypeScript báo lỗi ngay!
}]

// ✅ Đúng:
work: [{
  company: "99 Tech",
  title: "Senior Engineer",  // Đủ fields
  start: "2021",
  end: "2024",
}]
```

### 3. Component-Based (Dựa trên components)
- Mỗi phần nhỏ là 1 component độc lập
- Dễ test, dễ maintain
- Tái sử dụng được nhiều lần

### 4. Responsive by Default (Tự động responsive)
- Tailwind CSS có breakpoints sẵn: `sm:`, `md:`, `lg:`, `xl:`
- Không cần viết media queries thủ công

**Ví dụ:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/*
    - Mobile (< 768px): 1 cột
    - Tablet (768px+): 2 cột
    - Desktop (1024px+): 3 cột
  */}
</div>
```

### 5. Performance Optimized (Tối ưu hiệu suất)
Next.js tự động:
- Code splitting (chia nhỏ code, chỉ load phần cần thiết)
- Image optimization (tự động resize, compress ảnh)
- Route prefetching (load trước trang sắp vào)
- Server Components (giảm JavaScript gửi xuống client)

## Deployment (Triển khai)

### Cách 1: Vercel (Khuyến nghị - Miễn phí)
1. Push code lên GitHub
2. Import vào Vercel
3. Vercel tự động build & deploy
4. Có domain miễn phí: `yourname.vercel.app`

**Ưu điểm:**
- ✅ Hoàn toàn miễn phí
- ✅ Auto deploy khi push code mới
- ✅ SSL certificate tự động
- ✅ CDN toàn cầu (website load nhanh khắp thế giới)

### Cách 2: Docker
```bash
# Build Docker image
docker compose build

# Chạy container
docker compose up -d

# Website chạy tại http://localhost:3000
```

**Ưu điểm:**
- ✅ Chạy ở bất kỳ đâu có Docker
- ✅ Môi trường nhất quán (không bị "trên máy tôi chạy được mà")
- ✅ Dễ scale, dễ deploy lên cloud (AWS, GCP, Azure)

### Cách 3: VPS/Server thông thường
```bash
# Clone repo
git clone https://github.com/yourname/cv.git
cd cv

# Install dependencies
bun install

# Build
bun run build

# Run production server
bun start
```

## Customize (Tùy chỉnh)

### Thay đổi màu sắc
File: `tailwind.config.js`
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',    // Màu chính
        secondary: '#64748b',  // Màu phụ
      }
    }
  }
}
```

### Thay đổi font chữ
File: `src/app/google-fonts.css`
```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

File: `tailwind.config.js`
```javascript
fontFamily: {
  sans: ['Your Font', 'sans-serif'],
}
```

### Thêm section mới
1. Thêm data vào `resume-data.tsx`:
```typescript
export const RESUME_DATA = {
  // ... existing data
  awards: [  // Section mới
    {
      title: "Best Developer 2024",
      organization: "Tech Awards",
      date: "2024",
    }
  ]
}
```

2. Tạo component mới `src/app/components/Awards.tsx`
3. Import và dùng trong `src/app/page.tsx`

## Kết luận

Đây là một project **rất thông minh** vì:
1. ✅ Đơn giản để dùng (chỉ sửa 1 file data)
2. ✅ Mạnh mẽ về mặt kỹ thuật (Next.js, TypeScript, GraphQL)
3. ✅ Thiết kế đẹp, chuyên nghiệp
4. ✅ Performance tốt, SEO tốt
5. ✅ Dễ deploy, dễ maintain

**Phù hợp với ai?**
- Developers, Designers, Product Managers
- Bất kỳ ai muốn có CV online chuyên nghiệp
- Người cần chia sẻ CV qua link thay vì file PDF
- Người muốn học Next.js, TypeScript thông qua project thực tế

**Không phù hợp nếu:**
- Bạn cần CV có nhiều animation, video phức tạp (project này tập trung vào minimalism)
- Bạn cần hệ thống quản lý nhiều CV cho nhiều người (đây là single-user app)
- Bạn không có kiến thức code cơ bản (cần biết ít nhất cách sửa file, push code)

---

**Tác giả:** Ban Nguyen
**Ngày tạo:** 2025-11-15
**Phiên bản:** 1.0
