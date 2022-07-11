/* eslint-disable react-hooks/exhaustive-deps */
import { Row, Col, Layout, Modal, Menu } from "antd";
import "../css/menu.scss";
import "antd/dist/antd.min.css";
import { useCart } from "react-use-cart";
import { ShoppingCartOutlined, LogoutOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Header = ({ menuKey }) => {
  // collapsed
  const history = useNavigate();
  let local = JSON.parse(localStorage.getItem("data")); //fetching data from local storage
  let isAuthenticated = JSON.parse(localStorage.getItem("isAuthenticated")); //fetching data from local storage
  // disable browser back button
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };

  const { totalUniqueItems } = useCart();

  const { Header } = Layout;

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

  return (
    <div>
      <Header id="header" className="site-layout-background">
        <Row type="flex" align="middle">
        <Col span={6} offset={1} className="vertical-align">
          {/* logo */}
          <a href="/" className="logo-text">
                Food Delivery App
              </a>
        </Col>
          <Col span={10} offset={1} className="vertical-align">
            <Menu
              mode="horizontal"
              defaultSelectedKeys={[menuKey]}
              defaultOpenKeys={[menuKey]}
            >
              <Menu.Item key={1} onClick={() => history("/menu")}>
                Menu Items
              </Menu.Item>
              {isAuthenticated && local && (
                <>
                  <Menu.Item key={2} onClick={() => history("/cart")}>
                    Cart
                  </Menu.Item>

                  <Menu.Item key={3} onClick={() => history("/orders")}>
                    My Orders
                  </Menu.Item>
                </>
              )}
              {!isAuthenticated && local && (
                <>
                  <Menu.Item
                    key={"a1"}
                    onClick={() => history("/admin-dashboard")}
                  >
                    Admin Dashboard
                  </Menu.Item>
                </>
              )}
            </Menu>
          </Col>
          <Col span={3} className="vertical-align">
            {local && (
              <div className="text-end">
                {isAuthenticated && (
                  <>
                    <ShoppingCartOutlined
                      className="prl-5"
                      onClick={() => history("/cart")}
                    />
                    <sup>{totalUniqueItems}</sup>
                  </>
                )}
                <LogoutOutlined onClick={() => logout()} className="prl-10" />
              </div>
            )}
          </Col>
          <Col
            span={3}
            className="vertical-align workspace-select-col float-right"
          >
            <div className="text-end">
              <p className="prl-10 m-0">
                {" "}
                {local ? (
                  "Hi, " + local.name
                ) : (
                  <span>
                    <a href="/login">Login</a> / <a href="/signup">Signup</a>
                  </span>
                )}
              </p>
            </div>
          </Col>
        </Row>
      </Header>
    </div>
  );
};

export default Header;
