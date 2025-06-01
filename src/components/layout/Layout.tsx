import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="page-container">
      <Header />
      <main className="main-content pt-[var(--header-height)]">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;