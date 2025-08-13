import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Dashboard/Sidebar/Sidebar';

const Dashboard = () => {
    return (
        <div className='relative min-h-screen md:flex'>
            {/* sidebar */}
            <div>
                <Sidebar />
            </div>
            {/* outlet */}
            <div className='flex-1 md:ml-64'>
                <Outlet></Outlet>
            </div>
        </div>
    );
};

export default Dashboard;