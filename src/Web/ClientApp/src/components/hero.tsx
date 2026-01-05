import React from "react";
import { Button } from "../components/ui/button";
import HomeCarousel from "./home-carousel";
import { useNavigate } from "react-router-dom";
export default function Hero() {
   const navigate = useNavigate();
  return (
    <section className="bg-dark10 text-gray90 py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:space-x-10 items-center">
        {/* Left content */}
        <div className="md:w-2/3 space-y-8">
          <h5 className="text-yellow70 font-medium">
            Viết để chia sẻ, đọc để trưởng thành
          </h5>

          <h1 className="text-white text-4xl md:text-5xl font-heading font-bold leading-tight">
            Nơi lưu giữ những câu chuyện, góc nhìn và trải nghiệm
          </h1>

          <p className="text-gray50 text-base md:text-lg max-w-prose">
            Đây là không gian dành cho những bài viết về nhiều chủ đề khác nhau:
            công nghệ, sáng tạo, học tập, du lịch và cả những trải nghiệm đời
            sống thường ngày. Mỗi bài viết là một lát cắt nhỏ, được ghi lại với
            mong muốn mang đến giá trị, cảm hứng và góc nhìn mới cho người đọc.
          </p>

          {/* Carousel */}
          <div className="mt-6">
            <HomeCarousel />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mt-6">
            <Button
              onClick={() => {
                const el = document.getElementById("latest-posts");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-yellow55 text-dark10 hover:bg-yellow60 font-semibold transition"
            >
              Đọc bài mới
            </Button>
            <Button
              variant="outline"
              className="border-gray60 text-gray50 hover:text-yellow55 hover:border-yellow55"
            >
              Khám phá chủ đề
            </Button>
          </div>
        </div>

        {/* Right content */}
        <div className="mt-10 md:mt-0 md:w-1/3 flex flex-col items-center space-y-6">
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"
            alt="Blog đa chủ đề"
            className="hidden md:block h-80 w-80 object-cover rounded-lg shadow-xl"
          />

          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-semibold text-white">
              Nhiều chủ đề, nhiều góc nhìn
            </h2>
            <Button
             onClick={() => navigate(`/posts`)}
              variant="outline"
              className="border-gray60 text-gray50 hover:text-yellow55 hover:border-yellow55 text-sm px-4 py-2 rounded-sm"
            >
              Xem tất cả bài viết
            </Button>
          </div>
        </div>
      </div>

      {/* Background overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-yellow55/20 to-dark15/40 mix-blend-overlay" />
    </section>
  );
}
