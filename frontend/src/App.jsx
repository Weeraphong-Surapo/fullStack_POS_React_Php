import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layouts/Layout";
import Login from "./components/pages/Login";
import Pos from "./components/pages/Pos";
import Dashboard from "./components/pages/Dashboard";
import AllProduct from "./components/pages/product/AllProduct";
import UpdateProduct from "./components/pages/product/UpdateProduct";
import CreateProduct from "./components/pages/product/CreateProduct";
import AllCategory from "./components/pages/category/AllCategory";
import CreateCategory from "./components/pages/category/CreateCategory";
import UpdateCategory from "./components/pages/category/UpdateCategory";
import AllOrder from "./components/pages/order/AllOrder";
import OneOrder from "./components/pages/order/OneOrder";
import { useEffect, useState } from "react";
import { user } from "./components/functions/auth";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);

  const loadData = async () => {
    try {
      const res = await user();
      setIsLogin(res.data.success);
    } catch (err) {
      console.error(err);
      setIsLogin(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Routes>
      {/* Public Routes */}
      {!isLogin && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}

      {/* Protected Routes */}
      {isLogin && (
        <>
          <Route
            path="/"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/pos"
            element={
              <Layout>
                <Pos />
              </Layout>
            }
          />
          <Route
            path="/product"
            element={
              <Layout>
                <AllProduct />
              </Layout>
            }
          />
          <Route
            path="/product/create"
            element={
              <Layout>
                <CreateProduct />
              </Layout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <Layout>
                <UpdateProduct />
              </Layout>
            }
          />
          <Route
            path="/category"
            element={
              <Layout>
                <AllCategory />
              </Layout>
            }
          />
          <Route
            path="/category/create"
            element={
              <Layout>
                <CreateCategory />
              </Layout>
            }
          />
          <Route
            path="/category/:id"
            element={
              <Layout>
                <UpdateCategory />
              </Layout>
            }
          />
          <Route
            path="/order"
            element={
              <Layout>
                <AllOrder />
              </Layout>
            }
          />
          <Route
            path="/order/:id"
            element={
              <Layout>
                <OneOrder />
              </Layout>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
