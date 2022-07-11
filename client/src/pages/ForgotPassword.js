// External imports
import React, { useState } from "react";
import "antd/dist/antd.min.css"; //antd css
import { Row, Col, Image, Form, Input, Button, Modal } from "antd"; //antd components
import {
  MailOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"; //antd icons

// Internal imports
import "../css/authentication.scss";
import { basePath } from "../utils/request"; //base URL for Api's
import loginBg from "../assets/images/bg/login.jpg";

// functional component for forgot password
function ForgotPassword() {
  const [tableLoader, setTableLoader] = useState(false);

  // if error on form submit
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // on form submit
  const onFinish = (values) => {
    setTableLoader(true);

    // api integration to sent password reset link
    fetch(`${basePath}/users/password/reset/link`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setTableLoader(false);
          Modal.success({
            content: response.message,
          });
        } else {
          setTableLoader(false);
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        setTableLoader(false);
        console.log("Catch block");
        console.log(err);
      });
  };

  return (
    <div className="login">
      <Row className="authRow">
        <Col md={12} sm={24} xs={24} className="authentication-form-col">
          <Col md={{ span: 8, offset: 4 }} sm={24} xs={24} className="logoCol">
            {/* logo */}
            <a href="/" className="logo-text">
              Food Delivery App
            </a>
          </Col>

          <div className="authentication-form">
            <div className="top">
              <a href="/login">
                <div className="top-icon">
                  <p>
                    <ArrowLeftOutlined />
                  </p>
                </div>
              </a>
            </div>

            <div className="form">
              {/* form head */}
              <div className="heading">
                <h2 className="text-black">Forgot Password</h2>
                <p className="text">
                  Enter your email address to reset your password
                </p>
              </div>
              <Form
                name="forgotPassword"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                {/* email field */}
                <Form.Item
                  name="email"
                  className="inputWithIcon"
                  rules={[
                    {
                      type: "email",
                      message: "Please enter a valid email!",
                    },
                    {
                      required: true,
                      message: "Please enter email to continue!",
                    },
                  ]}
                >
                  <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>

                <Form.Item>
                  {/* submit button */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={tableLoader}
                    className="primaryBtn mt-5"
                    shape="round"
                  >
                    Forgot password{" "}
                    <span className="btnIcon">
                      <ArrowRightOutlined />
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </Col>

        {/* right side animation */}
        <Col md={12} sm={0} xs={0} className="authentication-bg-col">
          <Image src={loginBg} preview={false} />
        </Col>
      </Row>

      {/* {successModal && (
        <div>
          <Modal
            visible={successModal}
            footer={null}
            onOk={() => setSuccessModal(false)}
            onCancel={() => setSuccessModal(false)}
            className="successModal"
          >
            <div className="successModalBody">
              <Image src={successIcon} preview={false} />
            </div>
          </Modal>
        </div>
      )} */}
    </div>
  );
}

export default ForgotPassword;
