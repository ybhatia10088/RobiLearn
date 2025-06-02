import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main 
        className="flex-1 overflow-hidden"
        style={{ 
          height: `calc(100vh - var(--header-height) - var(--footer-height))` 
        }}
      >
        <div className="container mx-auto h-full p-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
