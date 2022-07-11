import React from 'react';
import 'antd/dist/antd.min.css';
import { useNavigate } from "react-router-dom";
import { Button, Result } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';

function Error() {
  let history = useNavigate();
  return (
    <div>
      {/* 404 error page */}
      <Result
        status="404"
        title="404"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary" className='primaryBtn' shape="round" onClick={() => history('/')}>Home  <span className="btnIcon" ><ArrowRightOutlined /></span></Button>}
      />
    </div>
  );
}

export default Error;