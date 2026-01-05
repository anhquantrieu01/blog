import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-dark20 bg-dark10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
          <Link
            to="/"
            className="flex items-center gap-3 text-xl font-semibold text-white transition hover:text-yellow55"
          >
            <img src="/favicon.png" alt="" className="size-6 " />
            <span className="font-heading tracking-wide">MyBlog</span>
          </Link>

          <nav className="flex flex-wrap gap-x-10 gap-y-4 text-base text-gray60">
            <Link to="/about" className="transition hover:text-yellow55">
              Về chúng tôi
            </Link>
            <Link to="/posts" className="transition hover:text-yellow55">
              Bài viết
            </Link>
            
          </nav>
        </div>

        <div className="my-10 h-px w-full bg-dark20" />

        <div className="flex flex-col gap-4 text-sm text-gray60 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray80">MyBlog</span>. All rights
            reserved.
          </span>

          <span>Designed and Developed by Quan.</span>
        </div>
      </div>
    </footer>
  );
}
