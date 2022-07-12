// External imports
import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Modal, Spin, Table, DatePicker, Input, Button } from "antd"; //antd components
import "antd/dist/antd.min.css"; //antd component css
import {
  SearchOutlined
} from "@ant-design/icons"; //antd icons


// Internal imports
import { basePath } from "../utils/request"; //base URL for Api's
import "../css/dashboard.scss";
import SideMenu from "../component/SideMenu";
import AdminHeader from "../component/AdminHeader";

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
// functional component for dashboard page
function DashboardOrdersPage() {
  const { Content } = Layout; //import content component from layout component
  const menuKey = "a3"; //setting default menu key to 'a2'

  // state for collapsed menu
  const [collapsed, setCollapsed] = useState(false);
  const [displayLogo, setDisplayLogo] = useState("block"); // logo on collapse menu
  const [spin, setSpin] = useState(false); // table spin
  const [ordersData, setOrdersData] = useState([]); // table data (orders list)
  const [startDate, setStartDate] = useState(); // start date from filters
  const [endDate, setEndDate] = useState(); // end date from filters
  const [searchVal, setSearchVal] = useState(); // search value

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
    if(!startDate && !endDate){
      fetchOrderDetails();
    }
    
    // eslint-disable-next-line
  }, [searchVal]);

  useEffect(() => {
    if(startDate && endDate){
    dateFilters();
    }
    // eslint-disable-next-line
  }, [startDate, endDate, searchVal]);

  //api integration for fetching order details
  const fetchOrderDetails = () => {
    setSpin(true);
    fetch(`${basePath}/listAll/orders`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setSpin(false);
          let menuData;
          if(searchVal){
           menuData = response.data.filter(data => `${(data.user.name).toLowerCase()}`.includes(searchVal)).map((item, index) => {
            let menuItems;
            let total = 0;
            if (item.orders_menu_items && item.orders_menu_items.length !== 0) {
              menuItems = item.orders_menu_items.map(
                (orders_menu_items, index) => {
                  total =
                    total +
                    orders_menu_items.quantity *
                      orders_menu_items.menu_item.price;
                  let innerTableRow = {
                    name:
                      orders_menu_items.menu_item.menu_item_name +
                      " x " +
                      orders_menu_items.quantity,
                    price:  'Rs .' +orders_menu_items.menu_item.price,
                    sub_total:
                    'Rs .' +
                      orders_menu_items.quantity *
                        orders_menu_items.menu_item.price,
                  };
                  return innerTableRow;
                }
              );
            } else {
              menuItems = "-";
            }

            let tableRow = {
              id: item.id,
              user_id: item.user ? item.user.id : "-",
              name: item.user ? item.user.name : "-",
              email: item.user ? item.user.email : "-",
              date: item.order_date,
              time: item.order_time,
              items: <Button onClick = {()=>{
                Modal.success({
                  icon: '',
                  title: 'Order ID :' + item.id,
                  content : (<><Table
                    pagination={false}
                    columns={itemColumns}
                    dataSource={menuItems}
                    loading={{
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                      spinning: spin,
                    }}
                  />
                 </>)
                })
              }}>View Items</Button>,
              total_price:  total,
            };
            return tableRow;
          });
        }
        else{
           menuData = response.data.map((item, index) => {
            let menuItems;
            let total = 0;
            if (item.orders_menu_items && item.orders_menu_items.length !== 0) {
              menuItems = item.orders_menu_items.map(
                (orders_menu_items, index) => {
                  total =
                    total +
                    orders_menu_items.quantity *
                      orders_menu_items.menu_item.price;
                  let innerTableRow = {
                    name:
                      orders_menu_items.menu_item.menu_item_name +
                      " x " +
                      orders_menu_items.quantity,
                    price:  orders_menu_items.menu_item.price,
                    sub_total:
                      orders_menu_items.quantity *
                        orders_menu_items.menu_item.price,
                  };
                  return innerTableRow;
                }
              );
            } else {
              menuItems = "-";
            }

            let tableRow = {
              id: item.id,
              user_id: item.user ? item.user.id : "-",
              name: item.user ? item.user.name : "-",
              email: item.user ? item.user.email : "-",
              date: item.order_date,
              time: item.order_time,
              items: <Button onClick = {()=>{
                Modal.success({
                  icon: '',
                  title: 'Order ID :' + item.id,
                  content : (<Table
                    pagination={false}
                    columns={itemColumns}
                    dataSource={menuItems}
                    loading={{
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                      spinning: spin,
                    }}
                  />)
                })
              }}>View Items</Button>,
              total_price:  total,
            };
            return tableRow;
          });
        }
          setOrdersData(menuData);
        } else {
          setSpin(false);
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        setSpin(false);
        console.log("Catch block");
      });
  };

  //api integration for fetching order details
  const dateFilters = () => {
    let newValues = {
      startDate : startDate,
      endDate : endDate
    }
    setSpin(true);
    fetch(`${basePath}/listAll/orders/dateFilter`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newValues),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setSpin(false);
          let menuData;
          if(searchVal){
           menuData = response.data.filter(data => `${(data.user.name).toLowerCase()}`.includes(searchVal)).reverse().map((item, index) => {
            let menuItems;
            let total = 0;
            if (item.orders_menu_items && item.orders_menu_items.length !== 0) {
              menuItems = item.orders_menu_items.map(
                (orders_menu_items, index) => {
                  total =
                    total +
                    orders_menu_items.quantity *
                      orders_menu_items.menu_item.price;
                  let innerTableRow = {
                    name:
                      orders_menu_items.menu_item.menu_item_name +
                      " x " +
                      orders_menu_items.quantity,
                    price:  orders_menu_items.menu_item.price,
                    sub_total:
                      orders_menu_items.quantity *
                        orders_menu_items.menu_item.price,
                  };
                  return innerTableRow;
                }
              );
            } else {
              menuItems = "-";
            }

            let tableRow = {
              id: item.id,
              user_id: item.user ? item.user.id : "-",
              name: item.user ? item.user.name : "-",
              email: item.user ? item.user.email : "-",
              date: item.order_date,
              time: item.order_time,
              items: <Button onClick = {()=>{
                Modal.success({
                  icon: '',
                  title: 'Order ID :' + item.id,
                  content : (<Table
                    pagination={false}
                    columns={itemColumns}
                    dataSource={menuItems}
                    loading={{
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                      spinning: spin,
                    }}
                  />)
                })
              }}>View Items</Button>, 
              total_price:  total,
            };
            return tableRow;
          });
        }
        else{
          menuData = response.data.reverse().map((item, index) => {
           let menuItems;
           let total = 0;
           if (item.orders_menu_items && item.orders_menu_items.length !== 0) {
             menuItems = item.orders_menu_items.map(
               (orders_menu_items, index) => {
                 total =
                   total +
                   orders_menu_items.quantity *
                     orders_menu_items.menu_item.price;
                 let innerTableRow = {
                   name:
                     orders_menu_items.menu_item.menu_item_name +
                     " x " +
                     orders_menu_items.quantity,
                   price:  orders_menu_items.menu_item.price,
                   sub_total:
                     orders_menu_items.quantity *
                       orders_menu_items.menu_item.price,
                 };
                 return innerTableRow;
               }
             );
           } else {
             menuItems = "-";
           }

           let tableRow = {
             id: item.id,
             user_id: item.user ? item.user.id : "-",
             name: item.user ? item.user.name : "-",
             email: item.user ? item.user.email : "-",
             date: item.order_date,
             time: item.order_time,
             items: <Button onClick = {()=>{
              Modal.success({
                icon: '',
                title: 'Order ID :' + item.id,
                content : (<Table
                  pagination={false}
                  columns={itemColumns}
                  dataSource={menuItems}
                  loading={{
                    indicator: (
                      <div>
                        <Spin />
                      </div>
                    ),
                    spinning: spin,
                  }}
                />)
              })
            }}>View Items</Button>,
             
             total_price:  total,
           };
           return tableRow;
         });
       }
          setOrdersData(menuData);
        } else {
          setSpin(false);
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        setSpin(false);
        console.log("Catch block");
      });
  };

  const columns = [
    {
      title: "Order ID",
      dataIndex: "id",
      key: "id",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.user_id - b.user_id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Order Time",
      key: "time",
      dataIndex: "time",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
    },
    {
      title: "Total Price in Rs.",
      dataIndex: "total_price",
      key: "total_price",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.total_price - b.total_price,
    },
  ];

  const itemColumns = [
    {
      title: "Name x Quantity",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price in Rs.",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Sub Total",
      dataIndex: "sub_total",
      key: "sub_total",
    },
  ];

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
              <Col span={6} className="vertical-align">
                <h2>Order Details</h2>
              </Col>
              <Col span={8} className="vertical-align">
              <Input
                prefix={<SearchOutlined />}
                onChange={(e)=> {setSearchVal(e.target.value)}}
                placeholder="Search by Name"
              />
              </Col>
              <Col span={8} offset={2} className="vertical-align">
              <RangePicker
      format={dateFormat}
      onChange={(value)=>{ setStartDate(value[0]); setEndDate(value[1]) }}
    />
              </Col>

            </Row>
           
            <Row type="flex" align="middle" className="mt-5">
              <Col span={24} className="vertical-align">
                <div className="items-table">
                  <Table
                    pagination= { { pageSize:'4', hideOnSinglePage: true, showSizeChanger: false, total: ordersData.length}}
                    columns={columns}
                    dataSource={ordersData}
                    loading={{
                      indicator: (
                        <div>
                          <Spin />
                        </div>
                      ),
                      spinning: spin,
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}
// .
export default DashboardOrdersPage;
