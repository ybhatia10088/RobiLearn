import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import CallToAction from '@/components/home/CallToAction';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <CallToAction />
    </Layout>
  );
};

export default HomePage;