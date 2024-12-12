import React,{ ReactNode } from 'react'
import Navbar from './Navbar/Navbar';
import Head from 'next/head';

type LayoutProps = {
    children: ReactNode;
};

const Layout:React.FC<LayoutProps> = ({ children })=> {
  return (
    <div>
        <Head>
          <title>Horizon TechShelf</title>
        </Head>
        <Navbar />
        {children}
    </div>
  );
};

export default Layout