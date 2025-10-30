import React from 'react';
import { Outlet } from 'react-router-dom';
import ProducerNavbar from '../components/ProducerNavbar';

function ProducerLayout() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ProducerNavbar />
      <Outlet /> {/* This is where your child pages will render */}
    </div>
  );
}

export default ProducerLayout;