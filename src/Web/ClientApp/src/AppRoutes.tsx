import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { paths } from "./config/paths";
import { AdminLayout, MainLayout } from "./components/layouts";
import { ProtectedRoute } from "./lib/ProtectedRoute";

const Home = lazy(() => import("./components/home"));
const About = lazy(() => import("./routes/home/About"));
const Profile = lazy(() => import("./routes/home/Profile"));

const BlogList = lazy(() => import("./routes/post/post"));
const BlogDetail = lazy(() => import("./routes/post/post-detailt"));

const Login = lazy(() => import("./routes/auth/login"));
const Register = lazy(() => import("./routes/auth/register"));

const AdminRoot = lazy(() => import("./features/admin/pages/AdminRoot"));
const Posts = lazy(() => import("./features/admin/pages/posts/Posts"));
const Users = lazy(() => import("./features/admin/pages/users/Users"));
const Create = lazy(() => import("./features/admin/pages/posts/Create"));
const Edit = lazy(() => import("./features/admin/pages/posts/Edit"));

const UserCreate = lazy(() => import("./features/admin/pages/users/Create"));
const UserEdit = lazy(() => import("./features/admin/pages/users/Edit"));
const NotFound = lazy(() => import("./routes/not-found"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          Loading...
        </div>
      }
    >
      <Routes>
        <Route path={paths.auth.login.path} element={<Login />} />
        <Route path={paths.auth.register.path} element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={paths.admin.root.path} element={<AdminRoot />} />
            <Route path={paths.admin.posts.path} element={<Posts />} />
            <Route path={paths.admin.posts.create.path} element={<Create />} />
            <Route path={paths.admin.posts.edit.path} element={<Edit />} />

            <Route path={paths.admin.users.path} element={<Users />} />
            <Route path={paths.admin.users.create.path} element={<UserCreate />} />
            <Route path={paths.admin.users.edit.path} element={<UserEdit />} />


          </Route>
        </Route>

        <Route element={<MainLayout />}>
          <Route path={paths.home.path} element={<Home />} />
          <Route path={paths.home.about.path} element={<About />} />

          <Route element={<ProtectedRoute />}>
            <Route path={paths.home.profile.path} element={<Profile />} />
          </Route>

          <Route path={paths.posts.root.path} element={<BlogList />} />
          <Route path={paths.posts.detail.path} element={<BlogDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
