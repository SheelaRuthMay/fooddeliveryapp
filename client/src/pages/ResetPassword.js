//External imports
import React, { useState, useEffect } from "react";
import "antd/dist/antd.min.css"; //antd css
import { useNavigate, useParams } from "react-router-dom"; //router
import PasswordChecklist from "react-password-checklist"; //password strength checklist package
import { Row, Col, Image, Form, Input, Button, Modal, Result } from "antd"; //antd components
import {
  UnlockOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons"; //antd icons

// Internal imports
import "../css/authentication.scss";
import { basePath } from "../utils/request"; //base URL for Api's
import loginBg from "../assets/images/bg/login.jpg";

function ResetPassword() {
  const { email } = useParams(); //get email from param
  const email1 = JSON.parse(email);
  let history = useNavigate(); //router

  const [authorised, setAuthorized] = useState(false); //to decide page authorization
  const [tableLoader, setTableLoader] = useState(false);
  const [password, setPassword] = useState(""); //for password
  const [cPassword, setCPassword] = useState(""); //for confirm-password
  const [display, setDisplay] = useState("none"); //password checklist display
  const [displayAgain, setDisplayAgain] = useState("none"); //confirm-password checklist display
  const [validP, setValidP] = useState(false); //verify password valid or not
  const [validCp, setValidCp] = useState(false); //verify confirm-password valid or not

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

  // on confirm-password field change
  const onCPasswordChange = (e) => {
    setCPassword(e.target.value);
    if (e.target.value) {
      setDisplayAgain("block");
    } else {
      setDisplayAgain("none");
    }
  };

  // Api to validate whether the user is authorized or not
  useEffect(() => {
    let data = {
      email1: email,
    };
    fetch(`${basePath}/validate/user`, {
      method: "POST",
      CORS: "no-cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      })
      .catch((err) => {
        setAuthorized(false);
        console.log("Catch block");
        console.log(err);
      });
    // eslint-disable-next-line
  }, []);

  // on form submit
  const onFinish = () => {
    if (validP && validCp) {
      setTableLoader(true);
      // data to send backend
      let reqBody = {
        password,
        cPassword,
        email1,
      };

      // api integration for update password
      fetch(`${basePath}/update/user/password`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqBody),
      })
        .then((res) => res.json())
        .then((response) => {
          if (response.status) {
            setTableLoader(false);
            Modal.success({
              content: response.message,
            });
            history(`/login`);
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
    }
  };

  return (
    <div className="login">
      <div>
        {authorised && email && (
          <Row className="authRow">
            <Col md={12} sm={24} xs={24} className="authentication-form-col">
              <Col
                md={{ span: 8, offset: 4 }}
                sm={24}
                xs={24}
                className="logoCol"
              >
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
                    <h2 className="text-black">Reset Password</h2>
                    <p className="text">Enter your new password to login</p>
                  </div>
                  <Form
                    name="resetPassword"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                  >
                    {/* password field */}
                    <Form.Item
                      name="password"
                      className="inputWithIcon"
                      // rules={[
                      //     {
                      //         required: true,
                      //         message: 'Please enter password to continue!',
                      //     },
                      // ]}
                    >
                      <Input.Password
                        onChange={onPasswordChange}
                        prefix={<UnlockOutlined />}
                        placeholder="New Password"
                      />

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
                        valueAgain={cPassword}
                        style={{ display: display }}
                        messages={{
                          lowercase: "Password must contain a lowercase letter",
                          capital: "Password must contain a capital letter",
                          number: "Password must contain a number",
                          specialChar:
                            "Password must contain a special character",
                          minLength:
                            "Password must contain atleast 8 characters",
                        }}
                        onChange={(isValid) => {
                          setValidP(isValid);
                        }}
                      />
                    </Form.Item>

                    {/* confirm-password field */}
                    <Form.Item
                      name="cpassword"
                      className="inputWithIcon"
                      // rules={[
                      //     {
                      //         required: true,
                      //         message: 'Please confirm your password!',
                      //     },
                      // ]}
                    >
                      <Input.Password
                        onChange={onCPasswordChange}
                        prefix={<UnlockOutlined />}
                        placeholder="Confirm New Password"
                      />

                      {/* confirm-password strength checklist */}
                      <PasswordChecklist
                        rules={["match"]}
                        value={password}
                        valueAgain={cPassword}
                        style={{ display: displayAgain }}
                        messages={{
                          match: "Password must match",
                        }}
                        onChange={(isValid) => {
                          setValidCp(isValid);
                        }}
                      />
                    </Form.Item>

                    {/* submit button */}
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={tableLoader}
                        className="primaryBtn mt-5"
                        shape="round"
                      >
                        Save{" "}
                        <span className="btnIcon">
                          <ArrowRightOutlined />
                        </span>
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </Col>

            {/* Right side animation */}
            <Col md={12} sm={0} xs={0} className="authentication-bg-col">
              <Image src={loginBg} preview={false} />
            </Col>
          </Row>
        )}
      </div>

      {/* render following code, if user is not authorized to access this page */}
      {!authorised && (
        // <div>You are not authorized to access this page</div>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, you are not authorized to access this page."
          extra={
            <Button type="primary" onClick={() => history("/login")}>
              Go Back
            </Button>
          }
        />
      )}
    </div>
  );
}

export default ResetPassword;
