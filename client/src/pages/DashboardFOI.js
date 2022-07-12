// External imports
import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Modal, Spin, Tag, Table, Select } from "antd"; //antd components
import "antd/dist/antd.min.css"; //antd component css

// Internal imports
import { basePath } from "../utils/request"; //base URL for Api's
import "../css/dashboard.scss";
import SideMenu from "../component/SideMenu";
import AdminHeader from "../component/AdminHeader";

// functional component for dashboard page
function DashboardFOI() {
    const { Option } = Select; //import option from antd select
  const { Content } = Layout; //import content component from layout component
  const menuKey = "a4"; //setting default menu key to 'a2'

  // state for collapsed menu
  const [collapsed, setCollapsed] = useState(false);
  const [displayLogo, setDisplayLogo] = useState("block"); // logo on collapse menu
  const [spin, setSpin] = useState(false); // table spin
  const [itemsData, setItemsData] = useState([]); // table data (menu items list)
  const [type, setType] = useState('all') // filters veg or non veg or all

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
    fetchFreqOrdered();
    // eslint-disable-next-line
  }, [type]);

  //api integration for fetching menu details
  const fetchFreqOrdered = () => {
    const newValues = {
        type: type
    }
    setSpin(true);
    fetch(`${basePath}/list/freqOrdered`, {
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
          console.log(response.data);
          const menuData = response.data.map((item, index) => {
            let availabilityDetails;
            if (
              item.menu[0].menu_item_availabilities &&
              item.menu[0].menu_item_availabilities.length !== 0
            ) {
              availabilityDetails = item.menu[0].menu_item_availabilities.map(
                (availabilities, index) => {
                  return (
                    <Tag style={{ fontSize: "10px", margin: "2px" }}>
                      {availabilities.availability.name}
                    </Tag>
                  );
                }
              );
            } else {
              availabilityDetails = "-";
            }

            let tableRow = {
              id: item.menu_item_id,
              times: item.totalTimes,
              name: item.menu[0].menu_item_name,
              type: item.menu[0].menu_item_type,
              cuisine: item.menu[0].cuisine,
              availability: availabilityDetails,
              price: item.menu[0].price,
              
            };
            return tableRow;
          });
          setItemsData(menuData);
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
      title: "Menu Item ID",
      dataIndex: "id",
      key: "id",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.id - b.id,
    },
    {
        title: "No. of Times Ordered",
        dataIndex: "times",
        key: "times",
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a.times - b.times,
      },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Type",
      key: "type",
      dataIndex: "type",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: "Cuisine",
      dataIndex: "cuisine",
      key: "cuisine",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.cuisine.localeCompare(b.cuisine),
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
    },
    {
      title: "Price in Rs.",
      dataIndex: "price",
      key: "price",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.price - b.price,
    }
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
              <Col span={10} className="vertical-align">
                <h2>Frequently Ordered Items</h2>
              </Col>
              <Col span={14} className="vertical-align">
              <Select
                showArrow
                style={{
                  width: "100%",
                }}
                onSelect={(val)=> setType(val)}
                placeholder="Select Menu Item Type"
                optionLabelProp="label"
                getPopupContainer={(trigger) => trigger.parentNode}
              >
                <Option value="all">All</Option>
                <Option value="Veg">Veg</Option>
                <Option value="Non-Veg">Non-Veg</Option>
              </Select>
              </Col>
            </Row>
            <Row type="flex" align="middle" className="mt-5">
            
              <Col span={24} className="vertical-align">
                <div className="items-table">
                  <Table
                    pagination= { { pageSize:'6', hideOnSinglePage: true, showSizeChanger: false, total: itemsData.length}}
                    columns={columns}
                    dataSource={itemsData}
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
export default DashboardFOI;
