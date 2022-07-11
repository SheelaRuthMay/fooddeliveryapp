// External imports
import React, { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Layout,
  Card,
  Modal
} from "antd"; //antd components
import "antd/dist/antd.min.css"; //antd component css
// Internal imports
import { basePath } from "../utils/request"; //base URL for Api's
import '../css/dashboard.scss';
import SideMenu from "../component/SideMenu";
import AdminHeader from "../component/AdminHeader";

// functional component for dashboard page
function DashboardPage() {
  const { Content } = Layout; //import content component from layout component
  const menuKey = "a1"; //setting default menu key to 'a1'

  // state for collapsed menu
  const [collapsed, setCollapsed] = useState(false);
  const [displayLogo, setDisplayLogo] = useState("block");
  const [itemsData, setItemsData] = useState([]); // table data (menu items list)
  const [ordersData, setOrdersData] = useState([]); // table data (orders list)

  // menu toggle function
  const menuToggle = () => {
    setCollapsed(!collapsed);
    if (collapsed === true) {
      setDisplayLogo("block");
    } else if (collapsed === false) {
      setDisplayLogo("none");
    }
  };

  useEffect(() => {
    fetchMenuItems();
    fetchOrderDetails();
    // eslint-disable-next-line
  }, []);

   //api integration for fetching menu details
   const fetchMenuItems = () => {
    fetch(`${basePath}/list/menu`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setItemsData(response.data);
        }

        else {
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        console.log("Catch block");
      });
  };

   //api integration for fetching order details
   const fetchOrderDetails = () => {
    fetch(`${basePath}/listAll/orders`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setOrdersData(response.data);
        }

        else {
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        console.log("Catch block");
      });
  };


  return (
    <div className="overflow-hidden">
      <Layout>
        {/* side menu */}
        <SideMenu
          collapsed={collapsed}
          displayLogo={displayLogo}
          menuKey={menuKey}
        />
        <Layout className="dashboard-bg admin-layout">
          <AdminHeader collapsed={collapsed} hamburger={menuToggle} />
          {/* dashboard page content */}
          <Content>
             <Row type="flex" align="middle" className="mt-5">
              <Col span={11} className="vertical-align">
                <Card className="name-card">
                  <Row type="flex" align="middle">
                    <a href="/items"><Col span={24} className="vertical-align">
                    <div className="user-name">Menu Items <span>{itemsData ? itemsData.length : 0}</span></div>
                    </Col></a>
                  </Row>
                </Card>
              </Col>
              <Col span={11} offset={1} className="vertical-align">
                <Card className="name-card">
                  <Row type="flex" align="middle">
                  <a href="/all-orders"><Col span={24} className="vertical-align">
                    <div className="user-name">Received Orders <span>{ordersData ? ordersData.length : 0}</span></div>
                    </Col></a>
                  </Row>
                </Card>
              </Col>
            </Row>
           
          </Content>
        </Layout>
      </Layout>

    </div>
  );
}
// .
export default DashboardPage;
