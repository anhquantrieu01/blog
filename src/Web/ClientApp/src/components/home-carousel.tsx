import React, { useState, useEffect } from "react";

interface Slide {
  title: string;
  description: string;
  image: string;
}

const slides: Slide[] = [
  {
    title: "Những chuyến đi mở rộng góc nhìn",
    description:
      "Ghi lại hành trình du lịch, trải nghiệm văn hóa và những khoảnh khắc đáng nhớ trên mỗi cung đường.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Công nghệ trong đời sống hiện đại",
    description:
      "Chia sẻ kiến thức, góc nhìn và những điều thú vị xoay quanh lập trình, công nghệ và xu hướng mới.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Viết lách, sáng tạo và phát triển bản thân",
    description:
      "Những câu chuyện, suy nghĩ và kinh nghiệm giúp bạn viết tốt hơn, sống chậm lại và hiểu mình hơn.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
  },
];

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-xl">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, idx) => (
          <div key={idx} className="flex-shrink-0 w-full">
            <div className="flex flex-col md:flex-row items-center bg-dark15 p-6 rounded-lg gap-6">
              <img
                src={slide.image}
                alt={slide.title}
                className="h-40 w-full md:h-48 md:w-48 object-cover rounded-lg"
              />
              <div className="space-y-2 md:space-y-4 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-heading font-semibold text-white">
                  {slide.title}
                </h3>
                <p className="text-gray50 text-sm md:text-base">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`h-2 w-2 rounded-full transition-all ${
              idx === current ? "bg-yellow55 w-4" : "bg-gray50"
            }`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={() =>
          setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray50 hover:text-yellow55 transition"
      >
        &#10094;
      </button>
      <button
        onClick={() =>
          setCurrent((prev) => (prev + 1) % slides.length)
        }
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray50 hover:text-yellow55 transition"
      >
        &#10095;
      </button>
    </div>
  );
}
