import React from "react";
import { ArrowRight } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Kỹ năng viết",
      description:
        "Chia sẻ cách viết bài blog cuốn hút, kể chuyện mạch lạc và giữ chân người đọc từ dòng đầu tiên đến câu kết.",
    },
    {
      title: "Góc nhìn công nghệ",
      description:
        "Cập nhật xu hướng mới, hướng dẫn thực tế và phân tích chuyên sâu về lập trình web, AI và các công cụ hiện đại.",
    },
    {
      title: "Nguồn cảm hứng sáng tạo",
      description:
        "Khám phá tư duy sáng tạo, ý tưởng thiết kế và những thói quen giúp bạn làm việc hiệu quả và khác biệt hơn mỗi ngày.",
    },
  ];

  return (
    <section className="bg-dark10 text-white px-6 py-20 mt-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 mb-14">
          <img src="/favicon.png" alt="Logo" className="w-20 h-20" />

          <div className="space-y-4 text-center md:text-left">
            <span className="px-3 py-1 bg-gray95/10 rounded-lg text-sm text-gray70">
              Đọc – Học hỏi – Phát triển
            </span>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Nơi chia sẻ những câu chuyện truyền cảm hứng
            </h2>
            <p className="text-gray60 max-w-2xl">
              Khám phá những góc nhìn, kinh nghiệm và câu chuyện hậu trường được
              chia sẻ trên blog. Dù bạn quan tâm đến công nghệ, sáng tạo hay phát
              triển bản thân — mỗi bài viết đều được tạo ra để khơi nguồn ý tưởng mới.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 bg-dark08 p-5">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-dark10 rounded-2xl p-6 flex flex-col justify-between hover:bg-[#1A1A1A] hover:shadow-xl hover:shadow-yellow55/10 transition-all duration-500 group"
            >
              <div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-yellow55 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray60 text-sm">
                  {feature.description}
                </p>
              </div>
              <div className="mt-6 flex justify-end">
                <div className="bg-yellow55 text-black p-2 rounded-full group-hover:rotate-45 transition-transform duration-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
