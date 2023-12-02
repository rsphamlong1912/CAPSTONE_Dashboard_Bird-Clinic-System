import React, { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { Table } from "antd";
import styles from "./Service.module.scss";
import { EditFilled } from "@ant-design/icons";
import { Tabs, Modal } from "antd";

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
    title: "ID Dịch vụ",
    dataIndex: "service_package_id",
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
    width: "10%",
  },
  {
    title: "Tên dịch vụ",
    dataIndex: "package_name",
    sorter: (a, b) => a.age - b.age,
    width: "30%",
  },
  {
    title: "Giá tiền",
    dataIndex: "price",
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
    width: "10%",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    width: "20%",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    render: (accountData) => {
      return accountData ? accountData.status : "";
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

// const onChange = (pagination, filters, sorter, extra) => {
//   console.log("params", pagination, filters, sorter, extra);
// };

const Service = () => {
  const [tab, setTab] = useState("ST001");
  const [open, setOpen] = useState();
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [serviceSelected, setServiceSelected] = useState();
  const [servicePackageList, setServicePackageList] = useState([]);

  //tab 1
  const [dataService, setDataService] = useState({
    package_name: "",
    price: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setDataService((dataService) => ({
      ...dataService,
      [name]: value,
    }));
  };

  const onChange = (key) => {
    console.log("change me", key);
    setTab(key);
  };

  const onHandleService = (item) => {
    setOpen(true);
    setServiceSelected(item);
    setDataService({
      package_name: item.package_name,
      price: item.price,
      description: item.description,
    });
    console.log("item", item);
  };

  const updateService = async () => {
    try {
      const response = await API.put(
        `/servicePackage/${serviceSelected.service_package_id}`,
        {
          name: dataService.package_name,
          price: dataService.price,
          detail: dataService.description,
        }
      );
      if (response) {
        console.log("Change thanh cong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceType = async () => {
    try {
      const response = await API.get(`/serviceType/`);
      if (response.data) {
        console.log("Data service type", response.data);
        setServiceTypeList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchServicePackage = async () => {
    try {
      const response = await API.get(`/servicePackage/?service_type_id=${tab}`);
      if (response.data) {
        console.log("Data service package", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
          action: (
            <Button
              type="primary"
              icon={<EditFilled />}
              onClick={() => onHandleService(item)}
            >
              Chỉnh sửa
            </Button>
          ),
        }));
        setServicePackageList(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServiceType();
  }, []);

  useEffect(() => {
    fetchServicePackage();
  }, [tab]);

  return (
    <div className={styles.container}>
      <h1>Danh sách dịch vụ</h1>
      <Modal
        title="Thông tin chi tiết dịch vụ"
        centered
        open={open}
        onOk={() => {
          updateService();
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        width={500}
      >
        <table className={styles.table}>
          <tbody>
            <tr>
              <th>Tên dịch vụ</th>
              <td>
                <input
                  type="text"
                  name="package_name"
                  value={dataService.package_name}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Giá tiền</th>
              <td>
                <input
                  type="text"
                  name="price"
                  value={dataService.price}
                  onChange={handleInputChange}
                />
              </td>
            </tr>
            <tr>
              <th>Mô tả</th>
              <td>
                <input
                  type="text"
                  name="description"
                  value={dataService.description || "Trống"}
                  onChange={handleInputChange}
                />{" "}
              </td>
            </tr>
          </tbody>
        </table>
      </Modal>
      <Tabs
        onChange={onChange}
        type="card"
        items={serviceTypeList.map((item, i) => {
          return {
            label: item.name,
            key: item.service_type_id,
          };
        })}
      />
      <Table
        columns={columns}
        dataSource={servicePackageList}
        onChange={onChange}
      />
    </div>
  );
};

export default Service;
