import React, { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { Table } from "antd";
import styles from "./Account.module.scss";
import { EditOutlined } from "@ant-design/icons";
import { BsPersonFillAdd } from "react-icons/bs";

import createAxios from "../services/axios";
const API = createAxios();


const columns = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: "Account",
    dataIndex: "account_id",
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
    // render: (serviceName) => {
    //   return serviceName ? serviceName.name : "";
    // },
    // sorter: (a, b) => a.service_name.localeCompare(b.service_name),
    width: "20%",
  },
  {
    title: "Số điện thoại",
    dataIndex: "phone",
    width: "10%",
  },
  {
    title: "Password",
    dataIndex: "password",
    render: (password) => {
      return password ? "**********" : '';
    },
    width: "10%",
    // sorter: (a, b) => {
    //   if (a.account && b.account) {
    //     return a.account.status.localeCompare(b.account.status);
    //   }
    //   return 0;
    // },
  },
  {
    title: "Vai trò",
    dataIndex: "role",
    // render: (accountData) => {
    //   return accountData ? accountData.status : '';
    // },
    width: "10%",
    sorter: (a, b) => {
      if (a.role && b.role) {
        return a.role.localeCompare(b.role);
      }
      return 0;
    },
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (accountData) => {
      return accountData ? accountData : '';
    },
    width: "10%",
    sorter: (a, b) => {
      if (a.status && b.status) {
        return a.status.localeCompare(b.status);
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

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Account = () => {
  const [dataVet, setDataVet] = useState([]);

  const fetchDataAccount= async () => {
    try {
      const response = await API.get(`/account/`);
      if (response.data) {
        console.log("Data Account", response.data);
        const dataAfterMap = response.data.map(
          (item, index) => (
            {
              ...item,
              index: index + 1,
              action: (<Button icon={<EditOutlined />} >Chỉnh sửa</Button>),
            })
        );
        setDataVet(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDataAccount();
  }, []);
  return (
  <main className="main-container">
    <div className={styles.top}>
    <h1 style={{color: 'black'}}>DANH SÁCH TÀI KHOẢN</h1>
    <Button type="primary" size="large">Tạo tài khoản</Button>
    </div>
      <Table columns={columns} dataSource={dataVet} onChange={onChange} />
  </main>
  )
};

export default Account;
