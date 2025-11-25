# MusicLearn Studio - Routes & Features Documentation

## 📚 Tổng Quan Hệ Thống

MusicLearn Studio là nền tảng học nhạc và sáng tác kết hợp, cung cấp đầy đủ các tính năng học tập, sáng tác, ghi âm và chia sẻ âm nhạc.

---

## 🗺️ Sơ Đồ Routes

### 🏠 **Public Routes** (Không yêu cầu đăng nhập)

#### Landing & Information Pages

| Route          | Mô tả                         | File                    |
| -------------- | ----------------------------- | ----------------------- |
| `/`            | Trang chủ (Landing page)      | `pages/index.vue`       |
| `/about`       | Giới thiệu về platform        | `pages/about.vue`       |
| `/features`    | Danh sách tính năng chi tiết  | `pages/features.vue`    |
| `/terms`       | Điều khoản sử dụng            | `pages/terms.vue`       |
| `/privacy`     | Chính sách bảo mật            | `pages/privacy.vue`     |
| `/credentials` | Thông tin đăng nhập mẫu (dev) | `pages/credentials.vue` |

#### Authentication

| Route                   | Mô tả             | File                             |
| ----------------------- | ----------------- | -------------------------------- |
| `/auth/login`           | Đăng nhập         | `pages/auth/login.vue`           |
| `/auth/register`        | Đăng ký tài khoản | `pages/auth/register.vue`        |
| `/auth/forgot-password` | Quên mật khẩu     | `pages/auth/forgot-password.vue` |

#### Course Discovery (Public)

| Route           | Mô tả                          | File                           |
| --------------- | ------------------------------ | ------------------------------ |
| `/courses`      | Danh sách khóa học công khai   | `pages/courses/index.vue`      |
| `/courses/[id]` | Chi tiết khóa học & enrollment | `pages/courses/[id]/index.vue` |

#### Music Discovery (Public)

| Route    | Mô tả                                      | File                    |
| -------- | ------------------------------------------ | ----------------------- |
| `/music` | Khám phá nhạc (Trending, Recent, My Music) | `pages/music/index.vue` |

---

### 👨‍🎓 **Student Routes** (Yêu cầu đăng nhập - Role: STUDENT)

#### Learning Dashboard

| Route                                        | Mô tả                        | File                                                  |
| -------------------------------------------- | ---------------------------- | ----------------------------------------------------- |
| `/student/courses`                           | Danh sách khóa học đã enroll | `pages/student/courses/index.vue`                     |
| `/student/courses/[id]`                      | Chi tiết khóa học đã enroll  | `pages/student/courses/[id]/index.vue`                |
| `/student/courses/[id]/chapters/[chapterId]` | Học bài (Chapter viewer)     | `pages/student/courses/[id]/chapters/[chapterId].vue` |

#### Progress & Stats

| Route               | Mô tả                    | File                         |
| ------------------- | ------------------------ | ---------------------------- |
| `/student/progress` | Theo dõi tiến độ học tập | `pages/student/progress.vue` |
| `/student/stats`    | Thống kê cá nhân         | `pages/student/stats.vue`    |

---

### 🎹 **Music Creation Routes** (Yêu cầu đăng nhập)

#### Studio & Composition

| Route                              | Mô tả                                   | File                           |
| ---------------------------------- | --------------------------------------- | ------------------------------ |
| `/music/studio`                    | Music Studio (Composer)                 | `pages/music/studio.vue`       |
| `/music/studio?compositionId=[id]` | Edit composition                        | `pages/music/studio.vue`       |
| `/music/compositions`              | Quản lý compositions (Drafts/Published) | `pages/music/compositions.vue` |

---

### 👨‍💼 **Admin Routes** (Yêu cầu đăng nhập - Role: ADMIN)

#### Dashboard & Analytics

| Route              | Mô tả                                           | File                        |
| ------------------ | ----------------------------------------------- | --------------------------- |
| `/admin/dashboard` | Tổng quan hệ thống                              | `pages/admin/dashboard.vue` |
| `/admin/analytics` | Phân tích chi tiết (Revenue, Students, Courses) | `pages/admin/analytics.vue` |

#### Course Management

| Route                          | Mô tả                   | File                                          |
| ------------------------------ | ----------------------- | --------------------------------------------- |
| `/admin/courses`               | Quản lý tất cả khóa học | `pages/admin/courses/index.vue`               |
| `/admin/courses/create`        | Tạo khóa học mới        | `pages/admin/courses/create.vue`              |
| `/admin/courses/[id]`          | Chỉnh sửa khóa học      | `pages/admin/courses/[id]/index.vue`          |
| `/admin/courses/[id]/chapters` | Quản lý chapters        | `pages/admin/courses/[id]/chapters/index.vue` |

#### User Management

| Route             | Mô tả                     | File                       |
| ----------------- | ------------------------- | -------------------------- |
| `/admin/students` | Quản lý học viên          | `pages/admin/students.vue` |
| `/admin/progress` | Theo dõi tiến độ học viên | `pages/admin/progress.vue` |

---

## 🎯 Tính Năng Theo Module

### 📚 **A. Learning System (Hệ Thống Học Tập)**

#### ✅ Đã Implement

- **Course Management (CRUD)**

  - ✓ Tạo/Sửa/Xóa khóa học (Admin)
  - ✓ Upload thumbnail cho khóa học
  - ✓ Phân loại theo level (Beginner/Intermediate/Advanced)
  - ✓ Publish/Unpublish khóa học

- **Chapter Management**

  - ✓ Tạo/Sửa/Xóa chapters trong khóa học
  - ✓ Upload video bài học
  - ✓ Upload audio examples
  - ✓ Upload sheet music (PDF)
  - ✓ Markdown content cho bài học
  - ✓ Thứ tự chapters (ordering)

- **Enrollment System**

  - ✓ Enroll vào khóa học
  - ✓ Kiểm tra enrollment status
  - ✓ API: `/api/v1/enrollments` (Backend)
  - ✓ Composable: `useEnrollmentApi.ts`

- **Progress Tracking**

  - ✓ Đánh dấu chapter hoàn thành
  - ✓ Tính % progress cho từng khóa học
  - ✓ Thống kê tổng thời gian học
  - ✓ Dashboard progress cho student
  - ✓ API: `/api/v1/student/progress`

- **Course Discovery**
  - ✓ Browse courses công khai
  - ✓ Search courses
  - ✓ Filter by level
  - ✓ View course details với chapters

#### ⚠️ Cần Bổ Sung

- **Quiz System** (Chưa có)

  - Quiz sau mỗi chapter
  - Đánh giá kiến thức

- **Certificate** (Chưa có)
  - Cấp chứng chỉ khi hoàn thành khóa học

---

### 🎹 **B. Music Creation Studio**

#### ✅ Đã Implement

- **Visual Composer**

  - ✓ Drag-and-drop note editor (Piano roll)
  - ✓ Multiple tracks (Piano, Guitar, Drums)
  - ✓ Real-time playback (Web Audio API)
  - ✓ Grid-based timeline

- **Controls**

  - ✓ BPM/Tempo adjustment (40-240)
  - ✓ Key selection (C, D, E, F, G, A, B)
  - ✓ Scale selection (Major, Minor, Dorian, etc.)
  - ✓ Volume controls per track
  - ✓ Mute/Solo tracks

- **Composition Management**

  - ✓ Save as Draft
  - ✓ Publish composition (with audio upload)
  - ✓ Edit existing compositions
  - ✓ Duplicate composition
  - ✓ Delete composition
  - ✓ API: `/api/v1/music/compositions`

- **Export Features**
  - ✓ Export to MP3 (via lamejs)
  - ✓ Export to MIDI
  - ✓ Save project as JSON (database)
  - ✓ Cloud storage (R2/S3)

#### ⚠️ Cần Bổ Sung

- **More Instruments** (Có thể mở rộng)

  - Thêm Bass, Strings, Brass, etc.

- **Effects** (Chưa có)
  - Reverb, Delay, Chorus
  - EQ controls

---

### 🎤 **C. Recording System**

#### ✅ Đã Implement

- **Audio Recording**

  - ✓ Microphone capture (MediaRecorder API)
  - ✓ Waveform visualization
  - ✓ Pause/Resume recording
  - ✓ Component: `AudioRecorder.vue`

- **Audio Processing**

  - ✓ Gain adjustment
  - ✓ Basic noise reduction
  - ✓ Preview before upload

- **File Management**
  - ✓ Upload recordings
  - ✓ API: `/api/v1/studio/recordings`
  - ✓ Cloud storage

#### ⚠️ Cần Bổ Sung

- **Advanced Processing** (Có thể mở rộng)
  - EQ, Compression
  - Pitch correction

---

### 🌐 **D. Social & Sharing Features**

#### ✅ Đã Implement

- **Music Sharing**

  - ✓ Publish compositions publicly
  - ✓ Public/Private visibility
  - ✓ Track metadata (title, genre, tags)

- **Trending System**

  - ✓ Trending tracks (by play count)
  - ✓ Genre filtering
  - ✓ API: `/api/v1/music/tracks/trending`

- **Engagement**

  - ✓ Like tracks
  - ✓ Comment system
  - ✓ View counts
  - ✓ Play history (Recent tracks)
  - ✓ API: `/api/v1/music/likes-comments`

- **Discovery**
  - ✓ Browse public music
  - ✓ Filter by genre (EDM, Lo-Fi, Classical, etc.)
  - ✓ Search functionality

#### ⚠️ Cần Bổ Sung

- **User Profiles** (Cơ bản có)

  - Portfolio của composer
  - Follow system (chưa có)

- **Playlists** (Chưa có)
  - Tạo playlists
  - Share playlists

---

### 💰 **E. Payment System**

#### ✅ Đã Implement (Backend)

- **Payment Entity & Repository**
  - ✓ Payment model (courseId, userId, amount)
  - ✓ API: `/api/v1/payments` (backend)
  - ✓ Revenue tracking
  - ✓ Monthly revenue stats

#### ⚠️ Cần Bổ Sung (Frontend)

- **Payment Flow** (TODO in code)
  - Chưa có UI payment
  - Chưa integrate payment gateway (Stripe/VNPay)
  - Button "Purchase" hiện chỉ là placeholder

#### 💡 Gợi Ý

```vue
<!-- TODO: Implement in courses/[id]/index.vue -->
const handlePurchase = async () => { // TODO: Integrate payment gateway // -
Stripe, VNPay, or similar // - Create payment intent // - Redirect to checkout
// - Handle callback };
```

---

### 👨‍💼 **F. Admin Dashboard**

#### ✅ Đã Implement

- **Analytics Dashboard**

  - ✓ Total revenue
  - ✓ Total students
  - ✓ Total courses
  - ✓ Active enrollments
  - ✓ Revenue charts (monthly)
  - ✓ Popular courses chart
  - ✓ Student growth chart

- **Course Management**

  - ✓ CRUD operations
  - ✓ Bulk actions
  - ✓ Upload media (thumbnails, videos, audio, sheets)

- **Student Management**

  - ✓ View all students
  - ✓ Enrollment tracking
  - ✓ Progress monitoring

- **Progress Monitoring**
  - ✓ Track student progress per course
  - ✓ Completion statistics

---

## 🔧 API Endpoints Summary

### Backend Modules Available

```
✓ /api/v1/auth           - Authentication (Login, Register, JWT)
✓ /api/v1/admin/courses  - Course Management (Admin)
✓ /api/v1/courses        - Public Course API
✓ /api/v1/admin/chapters - Chapter Management (Admin)
✓ /api/v1/enrollments    - Enrollment Management
✓ /api/v1/student/progress - Progress Tracking
✓ /api/v1/music/compositions - Composition Management
✓ /api/v1/music/tracks   - Music Track Upload & Discovery
✓ /api/v1/music/likes-comments - Social Features
✓ /api/v1/studio/recordings - Recording Management
✓ /api/v1/analytics      - Admin Analytics
✓ /api/v1/payments       - Payment Tracking (Backend only)
```

### Frontend Composables Available

```typescript
✓ useAuthApi.ts          - Authentication
✓ useCourseApi.ts        - Course Management (Admin)
✓ usePublicCourseApi.ts  - Public Courses
✓ useChapterApi.ts       - Chapter Management
✓ useEnrollmentApi.ts    - Enrollment (NEW)
✓ useProgressApi.ts      - Progress Tracking
✓ useCompositionApi.ts   - Music Compositions
✓ useMusicApi.ts         - Music Tracks
✓ useSocialApi.ts        - Likes & Comments
✓ useRecordingApi.ts     - Recordings
✓ useAnalyticsApi.ts     - Analytics
```

---

## 📊 Middleware & Guards

### Authentication Middleware

```typescript
✓ auth.ts     - Yêu cầu đăng nhập
✓ guest.ts    - Chỉ cho phép guest (chưa đăng nhập)
✓ admin.ts    - Yêu cầu role ADMIN
```

### Usage Examples

```vue
// Student pages definePageMeta({ middleware: ['auth'] }) // Admin pages
definePageMeta({ middleware: ['auth', 'admin'] }) // Auth pages (login/register)
definePageMeta({ middleware: ['guest'] })
```

---

## 🎨 Component Architecture

### Templates (Layouts)

```
✓ PublicLayout.vue  - Header + Footer cho public pages
✓ AuthLayout.vue    - Layout cho auth pages
✓ AdminLayout.vue   - Sidebar cho admin pages
```

### Organisms (Complex Components)

```
✓ CourseForm.vue          - Form tạo/sửa course
✓ ChapterForm.vue         - Form tạo/sửa chapter
✓ ChapterList.vue         - Danh sách chapters
✓ CourseTable.vue         - Table quản lý courses
✓ LoginForm.vue           - Form đăng nhập
✓ RegisterForm.vue        - Form đăng ký
✓ RevenueChart.vue        - Biểu đồ doanh thu
✓ PopularCoursesChart.vue - Biểu đồ khóa học phổ biến
✓ StudentGrowthChart.vue  - Biểu đồ tăng trưởng học viên
✓ TrackFeed.vue           - Danh sách tracks (music)
✓ GlobalModal.vue         - Modal hệ thống
```

### Molecules (Simple Components)

```
✓ CourseCard.vue          - Card hiển thị course
✓ CompositionCard.vue     - Card hiển thị composition
✓ TrackCard.vue           - Card hiển thị track
✓ AudioPlayer.vue         - Audio player
✓ AudioRecorder.vue       - Audio recorder
✓ AudioUploader.vue       - Audio uploader
✓ SheetUploader.vue       - Sheet music uploader
✓ TrackPlayer.vue         - Track player (controls)
✓ LikeButton.vue          - Like button
✓ CommentSection.vue      - Comment section
✓ MarkdownEditor.vue      - Markdown editor
✓ MusicUploadForm.vue     - Upload music form
✓ StatCard.vue            - Statistic card
✓ FormInput.vue           - Form input
✓ FormSelect.vue          - Form select
✓ FormTextarea.vue        - Form textarea
✓ PasswordInput.vue       - Password input
✓ ConfirmModal.vue        - Confirm modal
```

---

## 🔐 Authentication Flow

### JWT-Based Authentication

```
1. User login → POST /api/v1/auth/login
2. Receive JWT token
3. Store in AuthStore (Pinia)
4. Include in X-User-Id header for API calls
5. Middleware checks auth status
```

### User Roles

```typescript
enum UserRole {
  STUDENT = "STUDENT", // Default role
  ADMIN = "ADMIN", // Admin role
  INSTRUCTOR = "INSTRUCTOR", // (Có thể có trong tương lai)
}
```

---

## 🚀 Deployment & Configuration

### Environment Variables

```bash
# Runtime Config (nuxt.config.ts)
NUXT_PUBLIC_API_BASE=http://localhost:6888
NUXT_PUBLIC_APP_NAME=MusicLearn Studio
```

### Backend Configuration

```yaml
# application.properties
server.port=6888
spring.datasource.url=jdbc:postgresql://...
cloudflare.r2.endpoint=...
```

---

## 📝 Development Guidelines

### Adding New Routes

1. Tạo file `.vue` trong `app/pages/`
2. Cấu trúc folder = route structure
3. Thêm middleware nếu cần authentication
4. Update navigation trong layout

### Adding New API

1. Tạo controller trong backend
2. Tạo composable trong `composables/api/`
3. Define TypeScript types trong `types/`
4. Import và sử dụng trong components

### Adding New Features

1. Kiểm tra backend API có sẵn chưa
2. Tạo composable nếu cần
3. Tạo components
4. Tạo pages
5. Update routes trong README này

---

## ✅ Feature Checklist vs Requirements

### ✅ Hoàn Thành

- [x] Landing page với navigation
- [x] Authentication (Login/Register/JWT)
- [x] Course Management (Admin)
- [x] Chapter Management (Video, Audio, Sheet)
- [x] Enrollment System
- [x] Progress Tracking
- [x] Music Studio (Composer)
- [x] Recording Tools
- [x] Export (MP3, MIDI, JSON)
- [x] Public Music Gallery
- [x] Trending Music
- [x] Like & Comment
- [x] Genre Filtering
- [x] Admin Dashboard
- [x] Analytics (Revenue, Students, Courses)

### ⚠️ Cần Bổ Sung

- [ ] Payment Integration (Frontend UI)
- [ ] Quiz System
- [ ] Certificate System
- [ ] Follow/Following System
- [ ] Playlist Feature
- [ ] Advanced Audio Effects
- [ ] More Instruments in Studio

### 🔧 Backend Complete, Frontend TODO

- [ ] Payment Checkout Flow
- [ ] Payment History Page

---

## 📞 Contact & Support

**Project**: MusicLearn Studio
**Type**: Music Learning & Creation Platform
**Stack**: Nuxt 3 + Spring Boot + PostgreSQL + R2 Storage
**Version**: 1.0.0

---

**Last Updated**: 2024-11-24
