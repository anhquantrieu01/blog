import React from 'react'
import Hero from './hero'
import Head from "../components/seo/head";
import RecentPosts from './recent-post';
import FeaturedArticle from './feature-article';
import Features from './features';

const Home = () => {
  return (
    <>
        <Head title="Welcome to My App" />
        <Hero />
        <RecentPosts />
        <FeaturedArticle />
        <Features />
    </>
  )
}

export default Home
