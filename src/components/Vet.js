import React, { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { Table } from "antd";
import styles from "./Vet.module.scss";
import { EditOutlined } from "@ant-design/icons";

import createAxios from "../services/axios";
const API = createAxios();


const columns = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
    width: "10%",
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
    title: "Dịch vụ",
    dataIndex: "service",
    render: (serviceName) => {
      return serviceName ? serviceName.name : "";
    },
    sorter: (a, b) => a.service_name.localeCompare(b.service_name),
    width: "20%",
  },
  {
    title: "Service Type",
    dataIndex: "service_type_id",
    width: "10%",
  },
  {
    title: "Trạng thái",
    dataIndex: "account",
    render: (accountData) => {
      return accountData ? accountData.status : '';
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

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const Vet = () => {
  const [dataVet, setDataVet] = useState([]);

  const fetchDataVet= async () => {
    try {
      const response = await API.get(`/vet/`);
      if (response.data) {
        console.log("Data Vet", response.data);
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
    fetchDataVet();
  }, []);
  return (
  <div className={styles.container}>
    <h1>Danh sách bác sĩ</h1>
      <Table columns={columns} dataSource={dataVet} onChange={onChange} />
  </div>
  )
};

export default Vet;
