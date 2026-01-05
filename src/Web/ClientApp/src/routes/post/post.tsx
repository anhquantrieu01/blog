import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePosts } from "../../features/posts/api/getPosts";
import { useCategories } from "../../features/categories/api/getCategories";
import { PostSort } from "../../web-api-client";
import Head from "../../components/seo/head";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "../../components/ui/pagination";

export default function BlogList() {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= URL PARAMS ================= */
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const search = searchParams.get("search") ?? undefined;

  const categoryIdParam = searchParams.get("categoryId");
  const categoryId = categoryIdParam
    ? Number(categoryIdParam)
    : undefined;

  const sortParam = searchParams.get("sort");
  const sort =
    sortParam !== null
      ? (Number(sortParam) as PostSort)
      : PostSort.Newest;

  const pageSize = 8;

  /* ================= DATA ================= */
  const { data, isLoading, isFetching } = usePosts(
    page,
    pageSize,
    search,
    categoryId,
    sort,
  );

  const { data: categories } = useCategories();

  const posts = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  /* ================= HANDLERS ================= */
  const updateParams = (params: Record<string, string | undefined>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(params).forEach(([key, value]) => {
      if (!value) newParams.delete(key);
      else newParams.set(key, value);
    });

    newParams.set("page", "1"); // reset page
    setSearchParams(newParams);
  };

  const goToPage = (p: number) => {
    const params: Record<string, string> = {
      page: p.toString(),
      sort: sort.toString(),
    };
    
    if (search) params.search = search;
    if (categoryId) params.categoryId = categoryId.toString();
    
    setSearchParams(params);
  };

  /* ================= UI ================= */
  return (
    <>
      <Head title="Bài viết" />

      <section className="bg-dark10 text-white px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Tất cả bài viết</h2>

          {/* ===== FILTER BAR ===== */}
          <div className="flex flex-wrap gap-4 mb-10">
            {/* SEARCH */}
            <input
              defaultValue={search}
              placeholder="Tìm theo tiêu đề..."
              className="bg-dark08 border border-gray70 px-4 py-2 rounded w-64"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateParams({ search: e.currentTarget.value });
                }
              }}
            />

            {/* CATEGORY */}
            <select
              value={categoryId ?? ""}
              onChange={(e) =>
                updateParams({
                  categoryId: e.target.value || undefined,
                })
              }
              className="bg-dark08 border border-gray70 px-3 py-2 rounded"
            >
              <option value="">Tất cả danh mục</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) =>
                updateParams({ sort: e.target.value })
              }
              className="bg-dark08 border border-gray70 px-3 py-2 rounded"
            >
              <option value={PostSort.Newest}>Mới nhất</option>
              <option value={PostSort.Oldest}>Cũ nhất</option>
            </select>
          </div>

          {/* ===== POSTS ===== */}
          {isLoading && <p>Loading...</p>}

          <div className="grid md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                to={`/posts/${post.slug}`}
                key={post.id}
                className="rounded-xl overflow-hidden bg-dark08 hover:bg-dark15 transition"
              >
                <img
                  src={
                    post.thumbnailUrl ??
                    "https://via.placeholder.com/400x250"
                  }
                  alt={post.title || "Post thumbnail"}
                  className="w-full h-56 object-cover"
                />

                <div className="p-4 space-y-2">
                  <p className="text-xs text-white/60">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : "-"}
                  </p>

                  <h3
                    className="block text-lg font-semibold text-white hover:text-yellow55"
                  >
                    {post.title}
                  </h3>

                  <p className="text-gray60 text-sm">{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* ===== PAGINATION ===== */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => goToPage(page - 1)}
                      className={page === 1 ? "opacity-40 pointer-events-none" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => {
                    const p = i + 1;
                    return (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === page}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => goToPage(page + 1)}
                      className={
                        page === totalPages
                          ? "opacity-40 pointer-events-none"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {isFetching && (
            <p className="text-center text-xs text-gray60 mt-4">
              Đang tải dữ liệu...
            </p>
          )}
        </div>
      </section>
    </>
  );
}
