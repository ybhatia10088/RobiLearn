import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-4 pb-8 px-4 overflow-auto">
        <div className="container mx-auto h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};
