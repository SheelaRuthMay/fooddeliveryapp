// External imports
import React, { useState } from "react";
import "antd/dist/antd.min.css"; //antd css
import PasswordChecklist from "react-password-checklist"; //password strength checklist package
import { Row, Col, Image, Form, Input, Button, Modal } from "antd"; //antd components
import { useNavigate } from "react-router-dom"; //router
import {
  MailOutlined,
  UnlockOutlined,
  ArrowRightOutlined,
  UserOutlined
} from "@ant-design/icons"; //antd icons

// Internal imports
import "../css/authentication.scss";
import { basePath } from "../utils/request"; //base URL for Api's
import signupBg from "../assets/images/bg/signup.jpg";
function Signup() {
  let history = useNavigate(); //router

  const [cpassword, setCpassword] = useState(""); //for confirm-password
  const [password, setPassword] = useState(""); //for password
  const [display, setDisplay] = useState("none"); //password checklist display
  const [displayAgain, setDisplayAgain] = useState("none"); //confirm-password checklist display
  const [validP, setValidP] = useState(false); //verify password valid or not
  const [validCp, setValidCp] = useState(false); //verify confirm-password valid or not
  const [tableLoader, setTableLoader] = useState(false);

  // On form submit
  const onFinish = (values) => {
    // if password and confirm password valid, then proceed
    if (validP && validCp) {
      let value = {
        name: values.fullname,
        email: values.email,
        password: password
      };
      setTableLoader(true);

      // api integration for register user using form
      fetch(`${basePath}/users/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(value),
      })
        .then((res) => res.json())
        .then((response) => {
          setTableLoader(false);
          if (response.status === true) {
            Modal.success({
              content: response.message,
            });
            history(`/login`);
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
    }
  };

  // if error on submit
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // on password field change
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setDisplay("block");
    } else {
      setDisplay("none");
    }
  };
  // const div = document.querySelectorAll('li.sc-gsnTZi.eAyRRL.invalid');

  // on confirm-password field change
  const onCpasswordChange = (e) => {
    setCpassword(e.target.value);
    if (e.target.value) {
      setDisplayAgain("block");

    } else {
      setDisplayAgain("none");
    }
  };


  return (
    <div className="signup">
      <Row className="authRow">
        <Col md={12} sm={24} xs={24} className="authentication-form-col">
        <Row type="flex" align="middle">
          <Col md={{span: 8, offset: 4}} sm={12} xs={24} className="vertical-align logoCol">
            {/* logo */}
            <a href="/" className="logo-text">Food Delivery App</a>
            </Col>
            <Col md={12} sm={12} className="vertical-align">
            <div className="top-text">
                {/* link to login */}
                <p className="m-0">
                  Already a member ? <a href="/login">Login</a>
                </p>
              </div>
          </Col>
          </Row>
          <div className="authentication-form">
           
            <div className="signup-form form">
              {/* form head */}
              <div className="heading">
                <h2 className="text-black">Sign Up</h2>
                <p className="text">Order your favorite food with us</p>
              </div>
              <Form
                name="signup"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
              >
                {/* name field */}
                <Form.Item
                  name="fullname"
                  className="inputWithIcon"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your full name to continue!",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    required
                    placeholder="Full Name"
                  />
                </Form.Item>

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
                <Form.Item name="password" className="inputWithIcon">
                  <Input.Password
                    onChange={onPasswordChange}
                    prefix={<UnlockOutlined />}
                    required
                    placeholder="Password"
                  />
                  {/* <UnlockOutlined className="formIcon text" /> */}

                  {/* password strength checklist */}
                  <PasswordChecklist
                    rules={[
                      "minLength",
                      "specialChar",
                      "number",
                      "capital",
                      "lowercase",
                    ]}
                    minLength={8}
                    value={password}
                    valueAgain={cpassword}
                    style={{ display: display }}
                    messages={{
                      lowercase: "Password must contain a lowercase letter",
                      capital: "Password must contain a capital letter",
                      number: "Password must contain a number",
                      specialChar: "Password must contain a special character",
                      minLength: "Password must contain atleast 8 characters",
                    }}
                    onChange={(isValid) => {
                      setValidP(isValid);
                    }}
                  />
                </Form.Item>

                {/* confirm-password field */}
                <Form.Item name="cpassword" className="inputWithIcon">
                  <Input.Password
                    onChange={onCpasswordChange}
                    prefix={<UnlockOutlined />}
                    required
                    placeholder="Re-type Password"
                  />

                  {/* confirm-password strength checklist */}
                  <PasswordChecklist
                    rules={["match"]}
                    value={password}
                    valueAgain={cpassword}
                    style={{ display: displayAgain }}
                    messages={{
                      match: "Password must match",
                    }}
                    onChange={(isValid) => {
                      setValidCp(isValid);
                    }}
                  />
                </Form.Item>

                <Form.Item>
                  {/* signup button */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={tableLoader}
                    className="primaryBtn"
                    shape="round"
                  >
                    Signup
                    <span className="btnIcon">
                      <ArrowRightOutlined />
                    </span>
                  </Button>

                </Form.Item>
              </Form>
            </div>

            {/* already registered, login link */}
            <div className="top-text1">
              <p className="text-black">
                Already a member ? <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </Col>

        {/* Right side animation */}
        <Col md={12} sm={0} xs={0} className="authentication-bg-col">         
            <Image src={signupBg} preview={false} />
        </Col>
      </Row>
    </div>
  );
}

export default Signup;
