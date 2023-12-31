import React, { useState, useEffect } from "react";
import { Button, Flex, message, Popconfirm } from "antd";
import { Table } from "antd";
import styles from "./Customer.module.scss";
import { StopOutlined, CheckCircleOutlined } from "@ant-design/icons";

import createAxios from "../services/axios";
const API = createAxios();

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    filters: [
      {
        text: "Joe",
        value: "Joe",
      },
      {
        text: "Category 1",
        value: "Category 1",
      },
      {
        text: "Category 2",
        value: "Category 2",
      },
    ],
    filterMode: "tree",
    filterSearch: true,
    onFilter: (value, record) => record.name.startsWith(value),
    width: "20%",
  },
  {
    title: "Email",
    dataIndex: "email",
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    filters: [
      {
        text: "London",
        value: "London",
      },
      {
        text: "New York",
        value: "New York",
      },
    ],
    onFilter: (value, record) => record.address.startsWith(value),
    filterSearch: true,
    width: "20%",
  },
  {
    title: "Địa chỉ",
    dataIndex: "address",
    width: "30%",
  },
  {
    title: "Số tiền đã chi",
    dataIndex: "total_spent",
    render: (total_spent) => {
      return formattedPrice(total_spent);
    },
    width: "10%",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => {
      return status === "1" ? "Hoạt động" : "Bị cấm";
    },
    width: "10%",
    sorter: (a, b) => {
      if (a.account && b.account) {
        return a.account.status.localeCompare(b.account.status);
      }
      return 0;
    },
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "10%",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    action: (
      <Button type="primary" icon={<StopOutlined />} danger>
        Cấm
      </Button>
    ),
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    action: (
      <Button type="primary" icon={<StopOutlined />} danger>
        Cấm
      </Button>
    ),
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
    action: (
      <Button type="primary" icon={<StopOutlined />} danger>
        Cấm
      </Button>
    ),
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
    action: (
      <Button type="primary" icon={<StopOutlined />} danger>
        Cấm
      </Button>
    ),
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

// Định dạng tổng tiền theo tiền tệ Việt Nam
const formattedPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const Customer = () => {
  const [dataCustomer, setDataCustomer] = useState([]);

  // const confirm = (e) => {
  //   console.log(e);
  //   message.success("Click on Yes");
  // };
  // const cancel = (e) => {
  //   console.log(e);
  //   message.error("Click on No");
  // };

  const fetchDataCustomer = async () => {
    try {
      const response = await API.get(`/customer/`);
      if (response.data) {
        console.log("Data Customer", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
          action:
            item.account.status === "active" ? (
              <Popconfirm
                title="Xác nhận"
                description="Bạn có chắc muốn cấm người dùng này?"
                onConfirm={async (e) => {
                  console.log("yes", e);
                  try {
                    const response = await API.put(
                      `/customer/${item.customer_id}`,
                      {
                        status: "0",
                      }
                    );
                    if (response.data) {
                      console.log("Change success", response.data);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<StopOutlined />} danger>
                  Cấm
                </Button>
              </Popconfirm>
            ) : (
              <Popconfirm
                title="Xác nhận"
                description="Bạn có chắc muốn huỷ cấm người dùng này?"
                onConfirm={async (e) => {
                  console.log("yes", e);
                  try {
                    const response = await API.put(
                      `/customer/${item.customer_id}`,
                      {
                        status: "1",
                      }
                    );
                    if (response.data) {
                      console.log("Change success", response.data);
                    }
                  } catch (error) {
                    console.log(error);
                  }
                }}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" icon={<CheckCircleOutlined />}>
                  Hủy Cấm
                </Button>
              </Popconfirm>
            ),
        }));
        setDataCustomer(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataCustomer();
  }, []);

  return (
    <main className="main-container">
      <h1 style={{ color: "black" }}>DANH SÁCH KHÁCH HÀNG</h1>
      <Table columns={columns} dataSource={dataCustomer} onChange={onChange} />
    </main>
  );
};

export default Customer;
