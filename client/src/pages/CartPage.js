// External imports
import React, { useState } from "react";
import { Layout, Row, Col, Modal, Empty, Button } from "antd"; //antd components
import { useNavigate } from "react-router-dom"; //routing
import { useCart } from "react-use-cart";

//Internal imports
import TopHeader from "../component/Header";
import { basePath } from "../utils/request"; //base URL for Api's

// functional component for cart page
function CartPage() {
  const history = useNavigate(); //routing
  const { Content } = Layout; //import content from antd layout
  const menuKey = "2"; //set default menu key
  let local = JSON.parse(localStorage.getItem("data")); //fetching data from local storage

  const [buttonLoader, setButtonLoader] = useState(false); //on click place order load
  const {
    isEmpty,
    items,
    cartTotal,
    updateItemQuantity,
    removeItem,
    emptyCart
  } = useCart();

  const placeOrder = () => {
    let newValues = {
      user_id: local.id,
      items: items,
    };
    setButtonLoader(true);
    fetch(`${basePath}/place/order`, {
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
          setButtonLoader(false);
          Modal.success({
            content: response.message,
            onOk() {
              emptyCart()
              history("/orders");
            },
          });

          
        } else {
          setButtonLoader(false);
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        setButtonLoader(false);
        console.log("Catch block");
      });
  };
  return (
    <div>
      <Layout>
        <Layout className="website-layout">
          <TopHeader menuKey={menuKey} />
          <Content>
            <Row className="mt-10 mb-10">
              <Col span={24}>
                <div className="cart-table">
                  <div className="ant-table">
                    <div className="ant-table-container">
                      <div className="ant-table-content">
                        {!isEmpty && (
                          <>
                            <table style={{ tableLayout: "auto" }}>
                              <thead className="ant-table-thead">
                                <tr>
                                  <th className="ant-table-cell">Name</th>
                                  <th className="ant-table-cell">Type</th>
                                  <th className="ant-table-cell">Cuisine</th>
                                  <th className="ant-table-cell">Price</th>
                                  <th className="ant-table-cell">Quantity</th>
                                  <th className="ant-table-cell">Delete</th>
                                </tr>
                              </thead>
                              <tbody
                                className="ant-table-tbody"
                                style={{ width: "100%" }}
                              >
                                {items.map((item, index) => {
                                  return (
                                    <tr className="ant-table-row ant-table-row-level-0">
                                      <td className="ant-table-cell">
                                        {item.menu_item_name}
                                      </td>
                                      <td className="ant-table-cell">
                                        {item.menu_item_type}
                                      </td>
                                      <td className="ant-table-cell">
                                        {item.cuisine}
                                      </td>
                                      <td className="ant-table-cell">
                                        Rs. {item.price}
                                      </td>

                                      <td className="ant-table-cell">
                                        {item.quantity}
                                      </td>

                                      <td className="ant-table-cell">
                                        <Button
                                          onClick={() =>{
                                            updateItemQuantity(
                                              item.id,
                                              parseInt(item.quantity) - 1
                                            )
                                          }
                                          }
                                          className="btn btn-info ms-2"
                                        >
                                          {" "}
                                          -{" "}
                                        </Button>
                                        <Button
                                          onClick={() =>{
                                            
                                            updateItemQuantity(
                                              item.id,
                                              parseInt(item.quantity) + 1
                                            )
                                          }
                                          }
                                          className="btn btn-info ms-2"
                                        >
                                          {" "}
                                          +{" "}
                                        </Button>
                                        <Button
                                          onClick={() => removeItem(item.id)}
                                          className="btn btn-danger ms-2"
                                        >
                                          {" "}
                                          RemoveItem{" "}
                                        </Button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                            <Row className="mt-10 mb-10">
                              <Col span={10}>
                                <Button onClick={() => emptyCart()}>
                                  Clear Cart
                                </Button>
                              </Col>
                              <Col span={6} offset={8}>
                                <h2> Cart Total: Rs.{cartTotal}</h2>
                              </Col>
                              <Col span={6} offset={18}>
                                <Button
                                  loading={buttonLoader}
                                  onClick={() => placeOrder()}
                                >
                                  Place Order
                                </Button>
                              </Col>
                            </Row>
                          </>
                        )}
                        {isEmpty && (
                          <div className="text-center">
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description="No Data"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default CartPage;
