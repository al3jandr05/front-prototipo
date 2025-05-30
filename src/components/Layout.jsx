import React, { createContext, useContext, useState } from 'react';
import Sidebar from './Sidebar';
import '../styles/layout.css';

export const SidebarContext = createContext();

export const useSidebar = () => {
    return useContext(SidebarContext);
};

const Layout = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed }}>
            <div className="layout-container">
                <Sidebar />
                <main className={`layout-content ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
                    {children}
                </main>
            </div>
        </SidebarContext.Provider>
    );
};

export default Layout; 