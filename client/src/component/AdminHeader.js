/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Row, Col, Layout } from "antd";
import "../css/menu.scss";
import "antd/dist/antd.min.css";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

const AdminHeader = ({ hamburger, collapsed }) => {
  // collapsed
  let local = JSON.parse(localStorage.getItem("data")); //fetching data from local storage

  // disable browser back button
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };

  const { Header } = Layout;

  return (
    <div>
      <Header id="AdminHeader" className="site-layout-background">
        <Row type="flex" align="middle">
          <Col span={1} className="vertical-align">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: hamburger,
              }
            )}
          </Col>
          <Col span={23} className="vertical-align">
            {local && (
              <div>
                Welcome, <b>{local.name}</b>
              </div>
            )}
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default AdminHeader;
