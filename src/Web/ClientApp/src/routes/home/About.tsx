import { Link } from "react-router-dom";
import Head from "../../components/seo/head";

export default function About() {
  return (
   <>
   <Head title="Về chúng tôi" />
    <section className="min-h-screen bg-dark08 py-20 px-4 font-sans">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-14 text-center">
          <h1 className="font-heading text-4xl font-bold tracking-tight text-gray99 sm:text-5xl">
            Về chúng tôi
          </h1>
          <p className="mt-4 text-lg text-gray70">
            Nơi ghi lại suy nghĩ, kiến thức và hành trình học hỏi mỗi ngày.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          {/* Left content */}
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-semibold text-gray95">
              Blog này viết về điều gì?
            </h2>
            <p className="leading-relaxed text-gray70">
              Đây là blog cá nhân nơi mình chia sẻ kiến thức về lập trình,
              công nghệ, tư duy phát triển bản thân và những trải nghiệm
              trong quá trình học tập – làm việc.
            </p>
            <p className="leading-relaxed text-gray70">
              Nội dung được viết theo hướng dễ hiểu, thực tế và có thể áp dụng ngay,
              phù hợp cho người mới lẫn những ai đã có nền tảng.
            </p>
          </div>

          {/* Right card */}
          <div className="rounded-2xl border border-dark20 bg-dark10 p-8 shadow-lg">
            <h3 className="mb-6 font-heading text-xl font-semibold text-gray95">
              Giá trị mình theo đuổi
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-yellow55" />
                <p className="text-gray70">
                  Viết ngắn gọn, rõ ràng, đúng trọng tâm
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-yellow60" />
                <p className="text-gray70">
                  Ưu tiên kiến thức thực tế, dễ áp dụng
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-yellow70" />
                <p className="text-gray70">
                  Chia sẻ trung thực từ trải nghiệm cá nhân
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h3 className="font-heading text-2xl font-semibold text-gray95">
            Cảm ơn bạn đã ghé thăm
          </h3>
          <p className="mt-3 text-gray70">
            Hy vọng blog này mang lại cho bạn giá trị và cảm hứng học hỏi mỗi ngày.
          </p>
          <div className="mt-6 flex justify-center">
            <Link to="/posts" className="rounded-xl bg-yellow55 px-6 py-3 text-sm font-medium text-dark08 transition hover:bg-yellow60">
              Xem bài viết
            </Link>
          </div>
        </div>
      </div>
    </section>
   </>
  );
}
