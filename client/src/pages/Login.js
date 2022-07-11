//External imports
import React, { useState } from "react";
import "antd/dist/antd.min.css"; //antd css
import { Row, Col, Image, Form, Input, Button, Modal } from "antd"; //antd components
import { useNavigate } from "react-router-dom"; //router
import {
  MailOutlined,
  UnlockOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons"; //antd icons

//Internal imports
import "../css/authentication.scss";
import { basePath } from "../utils/request"; //base URL for Api's
import loginBg from "../assets/images/bg/login.jpg";

// functional component for login page
function Login() {
  let history = useNavigate(); //router

  const [tableLoader, setTableLoader] = useState(false);

  // if error on form submit
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // on form submit
  const onFinish = (values) => {
    setTableLoader(true);
    fetch(`${basePath}/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((response) => {
        setTableLoader(false);
        if (response.status === true) {
          // store user details on local storage
          localStorage.setItem("data", JSON.stringify(response.data[0]));
          if (response.data[0].isAdmin === false) {
            localStorage.setItem("isAuthenticated", true);
            history(`/menu`);
          } else if (response.data[0].isAdmin === true) {
            localStorage.setItem("isAuthenticatedAdmin", true);
            history(`/admin-dashboard`);
          }
        } else {
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
          <Row type="flex" align="middle">
            <Col
              md={{ span: 8, offset: 4 }}
              sm={12}
              xs={24}
              className="logoCol vertical-align"
            >
              {/* logo */}
              <a href="/" className="logo-text">
                Food Delivery App
              </a>
            </Col>
            <Col md={12} sm={12} className="vertical-align">
              <div className="top-text">
                {/* link to login */}
                <p className="m-0">
                  Not Registered Yet ? <a href="/signup">Create an Account</a>
                </p>
              </div>
            </Col>
          </Row>
          <div className="authentication-form">
            <div className="form">
              {/* form head */}
              <div className="heading">
                <h2 className="text-black">Login</h2>
                <p className="text">Login to Order Food</p>
              </div>
              <Form
                name="login"
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
                  <Input
                    prefix={<MailOutlined />}
                    required
                    placeholder="Email"
                  />
                  {/* <MailOutlined className="formIcon text" /> */}
                </Form.Item>

                {/* password field */}
                <Form.Item
                  name="password"
                  className="inputWithIcon"
                  rules={[
                    {
                      required: true,
                      message: "Please enter password to continue!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<UnlockOutlined />}
                    required
                    type="password"
                    placeholder="Password"
                  />
                  {/* <UnlockOutlined className="formIcon text" /> */}
                </Form.Item>

                <Form.Item>
                  <Row>
                    <Col span={12}></Col>
                    {/* forgot password link */}
                    <Col span={12}>
                      <div className="bottom-text">
                        <a href="/forgot-password">Forgot Password ?</a>
                      </div>
                    </Col>
                  </Row>
                </Form.Item>

                <Form.Item>
                  {/* login button */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={tableLoader}
                    className="primaryBtn"
                    shape="round"
                  >
                    Login{" "}
                    <span className="btnIcon">
                      <ArrowRightOutlined />
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </div>

            <div className="top-text1">
              <p className="text-black">
                Not Registered Yet ? <a href="/signup">Create an Account</a>
              </p>
            </div>
          </div>
        </Col>

        {/* Right side animation */}
        <Col md={12} sm={0} xs={0} className="authentication-bg-col">
          <Image src={loginBg} preview={false} />
        </Col>
      </Row>
    </div>
  );
}

export default Login;
