# Coding Project: Phân tích nội dung và đề xuất viết lại SEO với OpenAI API

## Những công nghệ, kiến trúc sử dụng trong project

**Server:**
1. Sử dụng framework Nestjs xây dựng server với mô hình microservice, sử dụng Redis thiết lập kết nối giữa các service (monorepo): 
 + Article service (CRUD bài viết )
 + Content-seo service (Tích hợp Gemini API xử lý nội dung bài viết)
 + Crawler service (Cào dữ liệu các bài viết trên trang VnExpress và gửi đến article service để lưu vào csdl)
2. Sử dụng MongDB cho việc lưu trữ bài viết
3. Sử dụng thư viện **@google/generative-ai** cho việc tích hợp Gemini Api để xử lý, phân tích nội dung và viết lại SEO cho bài viết
4. Sử dụng thư viện cheerio cho việc crawl data 

**Client:**
1. Sử dụng Reactjs cho việc xây dựng giao diện phía client
2. Cấu hình http request với thư viện axios 
3. Sử dụng thư viện UI Ant Design để xây dựng nhanh giao diện bằng các component cung cấp

## Yêu cầu trước khi chạy dự án

### Cài đặt Docker 
Tham khảo  https://docs.docker.com/engine/install/ để cài đặt docker

## Clone project và chạy dự án

Clone project về máy

Đứng tại thư mục root của project chạy lệnh:

```bash
docker-compose up
```

Khi hoàn tất quá trình build và run trên docker, ứng dụng sẽ chạy trên **http://localhost:8080**

## Resources
**NestJS** :  Refer to https://docs.nestjs.com/ to understand the concepts of NestJS
**Cheerio**: https://cheerio.js.org/docs/intro
**OpenAI API**: https://platform.openai.com/docs/overview
**Gemini API** : https://ai.google.dev/gemini-api/docs/quickstart?lang=node

**create-react-app** : The following link has all the commands that can be used with create-react-app
https://github.com/facebook/create-react-app

**ReactJS** : Refer to https://reactjs.org/ to understand the concepts of ReactJS
