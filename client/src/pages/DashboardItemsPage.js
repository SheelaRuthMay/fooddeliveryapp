// External imports
import React, { useEffect, useState } from "react";
import { Row, Col, Layout, Modal, Spin, Button, Tag, Table } from "antd"; //antd components
import "antd/dist/antd.min.css"; //antd component css
import { useNavigate } from "react-router-dom"; //routing
import { DeleteOutlined } from "@ant-design/icons"; //antd icons

// Internal imports
import { basePath } from "../utils/request"; //base URL for Api's
import "../css/dashboard.scss";
import SideMenu from "../component/SideMenu";
import AdminHeader from "../component/AdminHeader";
import AddItem from "../component/AddItem";

// functional component for dashboard page
function DashboardItemsPage() {
  const history = useNavigate(); //routing
  const { Content } = Layout; //import content component from layout component
  const menuKey = "a2"; //setting default menu key to 'a2'

  // state for collapsed menu
  const [collapsed, setCollapsed] = useState(false);
  const [displayLogo, setDisplayLogo] = useState("block"); // logo on collapse menu
  const [spin, setSpin] = useState(false); // table spin
  const [itemsData, setItemsData] = useState([]); // table data (menu items list)
  const [addItemModal, setAddItemModal] = useState(false); // add item form modal
  

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
    fetchMenuItems();
    // eslint-disable-next-line
  }, []);

  //api integration for fetching menu details
  const fetchMenuItems = () => {
    setSpin(true);
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
          setSpin(false);
          console.log(response.data);
          const menuData = response.data.map((item, index) => {
            let availabilityDetails;
            if (
              item.menu_item_availabilities &&
              item.menu_item_availabilities.length !== 0
            ) {
              availabilityDetails = item.menu_item_availabilities.map(
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
              id: item.id,
              name: item.menu_item_name,
              type: item.menu_item_type,
              cuisine: item.cuisine,
              availability: availabilityDetails,
              price: item.price,
              delete: (
                <div>
                  <DeleteOutlined
                    style={{
                      fontSize: "16px",
                      color: "red",
                      marginLeft: "20px",
                    }}
                    className="cursor-pointer"
                    onClick={() => {
                      deleteConfirm(item.id);
                    }}
                  />
                </div>
              ),
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Delete",
      dataIndex: "delete",
      key: "delete",
    },
  ];

  //closing add item modal
  const closeAddItem = () => {
    setAddItemModal(false);
  };

  //confirm modal to delete an item
  const deleteConfirm = (itemId) => {
    Modal.confirm({
      title: "delete item from menu",
      content: (
        <div>
          <p>Are you sure to delete this item ?</p>
        </div>
      ),
      okText: "Yes",
      cancelText: "No",
      onOk() {
        deleteItem(itemId);
      },
    });
  };

  //Api integration to delete an item
  const deleteItem = (itemId) => {
    fetch(`${basePath}/delete/item/${itemId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status === true) {
          Modal.success({
            content: response.message,
            onOk() {
              fetchMenuItems();
            },
          });
        } else {
          Modal.error({
            content: response.message,
          });
        }
      })
      .catch((err) => {
        console.log("Catch block");
        console.log(err);
      });
  };

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
              <Col span={20} className="vertical-align">
                <h2>Menu Items</h2>
              </Col>
              <Col span={4} className="vertical-align">
                <Button
                  type="primary"
                  className="primaryBtn mt-5"
                  style={{ width: "100%" }}
                  shape="round"
                  onClick={() => setAddItemModal(true)}
                >
                  Add New Item
                </Button>
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
      {/* add item modal */}
      {addItemModal && (
        <>
          <Modal
            className="form-modal"
            style={{ top: 0, right: 0 }}
            footer={false}
            visible={addItemModal}
            onCancel={() => {
              setAddItemModal(false);
              history(`/items`);
            }}
          >
            <AddItem
              className="modal-dialog"
              closeAddItem={closeAddItem}
              fetchMenuItems={fetchMenuItems}
            />
          </Modal>
        </>
      )}
    </div>
  );
}
// .
export default DashboardItemsPage;
