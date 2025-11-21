// src/app/pages/featured/Layout.jsx

import { Outlet } from "react-router-dom";

export default function FeaturedLayout() {
  return (
    <div className="p-4">
      {/* This will render child routes */}
      <Outlet />
    </div>
  );
}
