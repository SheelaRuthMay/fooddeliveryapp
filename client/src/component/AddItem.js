// Create client form
// External imports
import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css"; //antd component css
import { Row, Col, Form, Input, Button, Select, Modal } from "antd"; //antd components
import { useNavigate } from "react-router-dom"; //routing

// Internal Imports
import { basePath } from "../utils/request"; //base URL for Api's

// Functional componnet for Create Client
function AddItem({ closeAddItem, fetchMenuItems }) {
  const history = useNavigate(); //routing
  const { Option } = Select; //import option from antd select
  let local = JSON.parse(localStorage.getItem("data")); //fetching data from local storage

  //state management for add item
  const [buttonLoader, setButtonLoader] = useState(false); //loader on api integration
  const [availabilityData, setAvailabilityData] = useState([]); //availability dropdown

  //on submit form
  const onFinish = (values) => {
    setButtonLoader(true);

    let newValues = {
      menu_item_name: values.menu_item_name,
      menu_item_type: values.menu_item_type,
      cuisine: values.cuisine,
      availability: values.availability,
      price: values.price,
      created_by: local.id,
    };

    //Api integration for add item
    fetch(`${basePath}/add/item`, {
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
              closeAddItem();
              fetchMenuItems();
            },
          });
          history("/items");
        } else {
          //if can't create client
          setButtonLoader(false);
          history("/items");
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch(function (err) {
        //handle error
        setButtonLoader(false);
        Modal.error({
          content: "Not able to add item to menu. Please try again.",
        });
      });
  };

  const listAvailability = () => {
    fetch(`${basePath}/list/availability`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setAvailabilityData(response.data);
        } else {
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        console.log("Catch block");
      });
  };
  useEffect(() => {
    listAvailability();
    // eslint-disable-next-line
  }, []);
  //error on form submit
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
  return (
    //Rendered content on browser
    <div>
      <div>
        <div>
          {/* Form Head */}
          <div className="heading">
            <h2 className="text-black">Add Item</h2>
            <p className="text">Add a New Item to Menu</p>
          </div>
          <Form
            name="addMenuItem"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="menu_item_name"
              className=""
              rules={[
                {
                  required: true,
                  message: "Please enter menu item name!",
                },
              ]}
            >
              <Input
                id="menu_item_name"
                className="form-modal-input"
                placeholder="Menu Item Name *"
              />
            </Form.Item>

            <Form.Item
              name="menu_item_type"
              className="time-entry-item"
              rules={[
                {
                  required: true,
                  message: "Please select menu item type!",
                },
              ]}
            >
              <Select
                showArrow
                style={{
                  width: "100%",
                }}
                placeholder="Select Menu Item Type *"
                optionLabelProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                <Option value="Veg">Veg</Option>
                <Option value="Non-Veg">Non-Veg</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="cuisine"
              className=""
              rules={[
                {
                  required: true,
                  message: "Please enter menu cuisine!",
                },
              ]}
            >
              <Input className="form-modal-input" placeholder="Cuisine *" />
            </Form.Item>
            <Form.Item
              name="price"
              className=""
              rules={[
                {
                  required: true,
                  message: "Please enter menu item price",
                },
              ]}
            >
              <Input
                type="number"
                className="form-modal-input"
                placeholder="Price *"
                onKeyDown={blockInvalidChar}
                prefix={<>&#x20b9;</>}
              />
            </Form.Item>

            <Form.Item
              name="availability"
              className="time-entry-item"
              rules={[
                {
                  required: true,
                  message: "Please select menu item availability!",
                },
              ]}
            >
              <Select
                showArrow
                mode="multiple"
                style={{
                  width: "100%",
                }}
                placeholder="Select Availability *"
                optionLabelProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                {!availabilityData && (
                  <Option value="" disabled className="enq-select-option">
                    Loading...
                  </Option>
                )}

                {/* map availability names from availabilityData */}
                {availabilityData &&
                  availabilityData.map((availability) => (
                    <Option value={availability.name} key={availability.id}>
                      <div className="demo-option-label-item">
                        {availability.name}
                      </div>
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Row className="mt-3">
              <Col span={10} offset={1}></Col>
              <Col span={10} offset={1} className="text-end">
                {/* submit button */}
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={buttonLoader}
                    className="primaryBtn mt-5"
                    style={{ width: "100%" }}
                    shape="round"
                  >
                    Add
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
}
export default AddItem;
