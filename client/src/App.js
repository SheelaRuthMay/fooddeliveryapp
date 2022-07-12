import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CartProvider } from "react-use-cart";
import Login from "./pages/Login"; // login page
import Signup from "./pages/Signup"; // signup page
import ForgotPassword from "./pages/ForgotPassword"; // forgot password page
import ResetPassword from "./pages/ResetPassword"; // reset password page
import Error from "./pages/404"; // 404
import "./index.scss"; // common css
// inner pages
import DashboardPage from "./pages/DashboardPage"; // dashboard page
import DashboardItemsPage from "./pages/DashboardItemsPage"; // dashboard items page
import DashboardOrdersPage from "./pages/DashboardOrdersPage"; // dashboard orders page
import Menu from "./pages/MenuPage"; // menu page
import Cart from "./pages/CartPage"; // cart page
import Orders from "./pages/OrdersPage"; // orders page
import DashboardFOI from "./pages/DashboardFOI"; // frequently ordered items page
import { PrivateRoutes, PublicRoutes, AdminRoutes } from "./utils/common";


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/404" element={<Error />} />
        <Route exact path="/" element={<CartProvider><Menu /></CartProvider>} />
        <Route exact path="/menu" element={<CartProvider><Menu /></CartProvider>} />

        <Route element={<PublicRoutes />}>
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:email" element={<ResetPassword />} />
        </Route>

        <Route element={<PrivateRoutes />}>
        <Route exact path="/cart" element={<CartProvider><Cart /></CartProvider>} />
       
      {/* <Route exact path="/cart" element={<Cart />} /> */}
        <Route exact path="/orders" element={<CartProvider><Orders /></CartProvider>} />
        </Route>
        <Route element={<AdminRoutes />}>
          {/* inner pages */}
          <Route exact path="/admin-dashboard" element={<DashboardPage />} />
          <Route exact path="/items" element={<DashboardItemsPage />} />
          <Route exact path="/all-orders" element={<DashboardOrdersPage />} />
          <Route exact path="/frequently-ordered-items" element={<DashboardFOI />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
