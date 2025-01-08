import { Link } from "react-router-dom";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  DashboardOutlined,
  ProductOutlined,
  DropboxOutlined,
  UnorderedListOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const menus = [
  { name: "แดชบอร์ด", path: "/dashboard", icon: <DashboardOutlined /> },
  { name: "ขายสินค้า", path: "/pos", icon: <ShopOutlined /> },
  { name: "หมวดหมู่", path: "/category", icon: <DropboxOutlined /> },
  { name: "สินค้า", path: "/product", icon: <ProductOutlined /> },
  { name: "รายการขาย", path: "/order", icon: <UnorderedListOutlined /> },
];

const Layout = ({ children }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  const handleToggle = () => {
    setOpenSidebar((prev) => !prev); // Toggle the value
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    location.reload();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`bg-primary vh-100 ${openSidebar ? "d-none" : "col-md-2"}`}
        >
          <div className="sidebar p-2">
            <h1 className="text-white">POS</h1>
            <hr className="border-white" />
            <ul className="list-unstyled">
              {menus.map((item, index) => (
                <li key={index} className="p-1">
                  <Link
                    to={item.path}
                    className="text-white text-decoration-none"
                  >
                    <span className="me-2">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={`p-0 ${openSidebar ? "col-md-12" : "col-md-10"}`}>
          <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
              <button className="btn btn-secondary ms-2" onClick={handleToggle}>
                {openSidebar ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
              </button>
              <button
                className="float-end btn btn-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </nav>
          <div className="p-3">{children}</div> {/* Content of the page */}
        </div>
      </div>
    </div>
  );
};

export default Layout;
