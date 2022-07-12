// External imports
import React, { useState, useEffect } from "react";
import {
  Layout,
  Row,
  Col,
  Modal,
  Card,
  Tag,
  Button,
  Form,
  InputNumber,
  Image,
} from "antd"; //antd components
import { useCart } from "react-use-cart";
// Internal imports
import { basePath } from "../utils/request"; //base URL for Api's
import TopHeader from "../component/Header";
import slide2 from "../assets/images/bg/slide2.jpg";

const contentStyle = {
  width: "100%",
  height: "350px",
  textAlign: "center",
  overflow: "hidden",
};

// functional component for menu page
function MenuPage() {
  const { Content } = Layout; //import content from antd layout
  const menuKey = "1"; //set default menu key
  const [spinLoad, setSpinLoad] = useState(true); //spin on fetching data from database
  const [itemsData, setItemsData] = useState([]); // table data (menu items list)
  let isAuthenticatedAdmin = localStorage.getItem("isAuthenticatedAdmin");
  let local = localStorage.getItem("data");
  console.log(useCart());

  const {
    items,
    updateItemQuantity,
    removeItem,
    addItem, inCart, getItem } =
    useCart();

  useEffect(() => {
    fetchMenuItems();
    // eslint-disable-next-line
  }, []);

  //api integration for fetching menu details
  const fetchMenuItems = () => {
    setSpinLoad(true);
    fetch(`${basePath}/list/menu`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          console.log(response.data);
          setSpinLoad(false);
          setItemsData(response.data);
        } else {
          setSpinLoad(false);
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        setSpinLoad(false);
        console.log("Catch block");
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = (values) => {
    console.log("values:", values);
  };

  return (
    <div>
      <Layout>
        <Layout className="website-layout">
          <TopHeader menuKey={menuKey} />
          <Content>
            <Row className="mb-10" type="flex" align="middle">
              <Col span={24}>
                <div style={contentStyle}>
                  <Image preview={false} src={slide2} />
                </div>
              </Col>
            </Row>
            <Row className="mt-5 mb-3" type="flex" align="middle">
              {!spinLoad &&
                itemsData &&
                itemsData.length !== 0 &&
                itemsData.map((item) => {
                  return (
                    /* item data card */
                    <Col
                      className="vertical-align clickable-col"
                      span={7}
                      offset={1}
                    >
                      <Card className="list-card menu-card mb-10 mt-10">
                        <Row type="flex" align="middle">
                          <Col span={24} className="vertical-align">
                            <h3 className="item-name clickable-col-text">
                              {item.menu_item_name}{" "}
                              <span className="item-type">
                                ({item.menu_item_type})
                              </span>
                            </h3>
                            <p className="item-cuisine">
                              Cuisine : {item.cuisine}
                            </p>
                            <p className="item-price">Rs. {item.price}</p>
                            <p>
                              {item.menu_item_availabilities &&
                                item.menu_item_availabilities.length !== 0 &&
                                item.menu_item_availabilities.map(
                                  (availability) => {
                                    return (
                                      <Tag
                                        style={{
                                          fontSize: "10px",
                                          margin: "2px",
                                        }}
                                      >
                                        {availability.availability.name}
                                      </Tag>
                                    );
                                  }
                                )}
                            </p>
                          </Col>
                        </Row>
                        {!isAuthenticatedAdmin && local && (
                          <Row type="flex" align="middle">
                            {inCart(item.id) === false && (
                              <Col span={24} className="vertical-align">
                                <Form
                                  name="addToCart"
                                  onFinish={onFinish}
                                  onFinishFailed={onFinishFailed}
                                  fields={[
                                    {
                                      name: ["quantity"],
                                      value: 1,
                                    },
                                  ]}
                                >
                                  <Row type="flex" align="middle">
                                    <Col
                                      span={2}
                                      offset={5}
                                      className="vertical-align"
                                    >
                                      <Form.Item
                                        name="quantity"
                                        className=""
                                        rules={[
                                          {
                                            required: true,
                                            message: "Please enter quantity",
                                          },
                                        ]}
                                      >
                                        <InputNumber
                                          id={"quantity" + item.id}
                                          min={1}
                                          defaultValue={1}
                                        />
                                      </Form.Item>
                                    </Col>

                                    <Col
                                      span={10}
                                      offset={5}
                                      className="vertical-align"
                                    >
                                      <Form.Item>
                                        <Button
                                          type="dashed"
                                          style={{ width: "100%" }}
                                          shape="round"
                                          onClick={() => {
                                            let itemAdd = {
                                              id: item.id,
                                              menu_item_name:
                                                item.menu_item_name,
                                              menu_item_type:
                                                item.menu_item_type,
                                              cuisine: item.cuisine,
                                              price: item.price,
                                              quantity: document.getElementById(
                                                "quantity" + item.id
                                              ).value,
                                            };
                                            addItem(item, itemAdd.quantity);
                                          }}
                                        >
                                          Add to Cart
                                        </Button>
                                      </Form.Item>
                                    </Col>
                                  </Row>
                                </Form>
                              </Col>
                            )}

                            {inCart(item.id) === true &&
                              items
                                .filter((x) => x.id === item.id)
                                .map((itemCart, index) => {
                                  return (
                                    <>
                                      <Button
                                        type="dashed"
                                        shape="round"
                                        onClick={() =>
                                          updateItemQuantity(
                                            itemCart.id,
                                            parseInt(itemCart.quantity) - 1
                                          )
                                        }
                                      >
                                        -
                                      </Button>
                                      <Button type="dashed" shape="round">
                                        {getItem(itemCart.id).quantity}
                                      </Button>
                                      <Button
                                        type="dashed"
                                        shape="round"
                                        onClick={() =>
                                          updateItemQuantity(
                                            itemCart.id,
                                            parseInt(itemCart.quantity) + 1
                                          )
                                        }
                                      >
                                        +
                                      </Button>
                                      <Button
                                        type="dashed"
                                        shape="round"
                                        onClick={() => removeItem(itemCart.id)}
                                      >
                                        Remove Item
                                      </Button>
                                    </>
                                  );
                                })}
                          </Row>
                        )}
                      </Card>
                    </Col>
                  );
                })}
            </Row>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default MenuPage;
