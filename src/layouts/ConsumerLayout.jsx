import React from 'react';
import { Outlet } from 'react-router-dom';
import ConsumerNavbar from '../components/ConsumerNavbar';

function ConsumerLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ConsumerNavbar />
      <Outlet /> {/* This is where your child pages will render */}
    </div>
  );
}

export default ConsumerLayout;