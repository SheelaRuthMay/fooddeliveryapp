/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Row, Layout, Menu, Modal } from "antd";
import "../css/menu.scss";
import "antd/dist/antd.min.css";
import {
  ClockCircleOutlined,
  MessageOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  UnorderedListOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const SideMenu = ({ menuKey, collapsed, displayLogo }) => {
  const history = useNavigate();
  const { Sider } = Layout;

  const logout = () => {
    Modal.confirm({
      title: "Logout",
      content: (
        <div>
          <p>Are you sure to logout ?</p>
        </div>
      ),
      okText: "Yes",
      cancelText: "No",
      onOk() {
        localStorage.clear();
        Modal.success({
          content: "You are successfully logged out.",
        });
        history(`/menu`);
      },
    });
  };

  //main menu
  var mainMenu = [
    {
      key: "a1",
      icon: (
        <div onClick={() => history("/admin-dashboard")}>
          <AppstoreOutlined />
        </div>
      ),
      label: <div onClick={() => history("/admin-dashboard")}>Dashboard</div>,
    },
    {
      key: "a2",
      icon: (
        <div onClick={() => history("/items")}>
          <UnorderedListOutlined />
        </div>
      ),
      label: <div onClick={() => history("/items")}>Menu Items</div>,
    },
    {
      key: "a3",
      icon: (
        <div onClick={() => history("/all-orders")}>
          <MessageOutlined />
        </div>
      ),
      label: <div onClick={() => history("/all-orders")}>Received Orders</div>,
    },
    {
      key: "a4",
      icon: (
        <div onClick={() => history("/frequently-ordered-items")}>
          <ClockCircleOutlined />
        </div>
      ),
      label: <div onClick={() => history("/frequently-ordered-items")}>Frequently Ordered</div>,
    },
  ];

  return (
    <div className="sidebar">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Row className="menuTop" style={{ display: displayLogo }}>
          {/* Sidebar fixed top start */}
          {/* fixedTopMenu */}
          <div className="fixedTopMenu">
            <div className="sidebar-logo">
              <a href="/" className="logo-text">
                Food Delivery App
              </a>
            </div>
          </div>
          {/* Sidebar fixed top ends */}
        </Row>
        {/* main menu start */}
        <Menu
          className="main-menu"
          theme="light"
          mode="inline"
          defaultSelectedKeys={[menuKey]}
          defaultOpenKeys={[menuKey]}
          items={mainMenu}
        />
        {/* main menu ends */}

        {/* sidebar logout fixed bottom start */}
        <Menu
          className="logoutFixed"
          theme="light"
          mode="inline"
          items={[
            {
              icon: <LogoutOutlined />,
              label: <div onClick={() => logout()}>Logout</div>,
            },
          ]}
        />
        {/* sidebar logout fixed bottom ends */}
      </Sider>
    </div>
  );
};

export default SideMenu;
