import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from '../pages/Landing';
import { Shop } from '../pages/Shop';
import { ProductDetail } from '../pages/ProductDetail';
import { Checkout } from '../pages/Checkout';
import { Confirmation } from '../pages/Confirmation';
import { Proposal } from '../pages/Proposal';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/3ds" element={<Checkout />} />
      <Route path="/order/:id" element={<Confirmation />} />
      <Route path="/proposal" element={<Proposal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
