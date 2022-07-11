// External imports
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Table, Spin, Modal, Button } from "antd"; //antd components

//Internal imports
import TopHeader from "../component/Header";
import { basePath } from "../utils/request"; //base URL for Api's

// functional component for orders page
function OrdersPage() {
  const { Content } = Layout; //import content from antd layout
  const menuKey = "3"; //set default menu key
  const local = JSON.parse(localStorage.getItem("data"));
  const [spin, setSpin] = useState(false); // table spin
  const [ordersData, setOrdersData] = useState([]); // table data (orders list)

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line
  }, []);

  //api integration for fetching order details
  const fetchOrderDetails = () => {
    setSpin(true);
    fetch(`${basePath}/list/order/${local.id}`, {
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
          console.log(response.data);
          const menuData = response.data.map((item, index) => {
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
                    type: orders_menu_items.menu_item.menu_item_type,
                    price: "Rs. " + orders_menu_items.menu_item.price,
                    sub_total:
                      "Rs. " +
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
              date: item.order_date,
              time: item.order_time,
              items: <Button onClick = {()=>{
                Modal.success({
                  icon: '',
                  title: 'Order ID :' + item.id,
                  content : (<Table
                    pagination={false}
                    columns={innerColumns}
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
              }}>View Items</Button>
              ,
              total_price: "Rs. " + total,
            };
            return tableRow;
          });
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
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
  ];

  const innerColumns = [
    {
      title: "Name x Quantity",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
    },
    {
      title: "Price",
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
    <div>
      <Layout>
        <Layout className="website-layout">
          <TopHeader menuKey={menuKey} />
          <Content>
            <Row type="flex" align="middle" className="mt-5">
              <Col span={24} className="vertical-align">
                <div className="items-table">
                  <Table
                    pagination= { { pageSize:'5', hideOnSinglePage: true, showSizeChanger: false, total: ordersData.length}}
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

export default OrdersPage;
