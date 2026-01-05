export const paths = {
  home: {
    path: '/',
    getHref: () => '/',

    profile: {
      path: '/profile',
      getHref: () => '/profile',
    },
    about: {
      path: '/about',
      getHref: () => '/about',
    },
    
  },

  auth: {
    register: {
      path: '/auth/register',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
    },
  },

  posts: {
    root: {
      path: '/posts',
      getHref: () => '/posts',
    },
    detail: {
      path: '/posts/:slug',
      getHref: (slug: string) => `/posts/${slug}`,
    },
  },

  admin: {
    root: {
      path: '/admin',
      getHref: () => '/admin',
    },
    dashboard: {
      path: 'dashboard',
      getHref: () => '/admin/dashboard',
    },
    posts: {
      path: '/admin/posts',
      getHref: () => '/admin/posts',
      create:{
        path: '/admin/posts/create',
        getHref: () => '/admin/posts/create',
      },
      edit:{
        path: '/admin/posts/edit/:id',
        getHref: (id: string) => `/admin/posts/edit/${id}`,
      }
    },
    blog: {
      path: 'blogs/:blogId',
      getHref: (id: string) => `/admin/dashboard/blogs/${id}`,
    },
    users: {
      path: '/admin/users',
      getHref: () => '/admin/users',
      create: {
        path: '/admin/users/create',
        getHref: () => '/admin/users/create',
      },
      edit: {
        path: '/admin/users/edit/:id',
        getHref: (id: string) => `/admin/users/edit/${id}`,
      }
    },
    profile: {
      path: 'profile',
      getHref: () => '/admin/dashboard/profile',
    },
  },
} as const;