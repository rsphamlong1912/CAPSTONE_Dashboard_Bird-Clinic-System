import React, { useState, useEffect } from "react";
import { Button, Flex, Form, Input, Select } from "antd";
import { Table } from "antd";
import styles from "./Service.module.scss";
import { EditFilled } from "@ant-design/icons";
import { BsPersonFillAdd } from "react-icons/bs";
import { Tabs, Modal, message } from "antd";

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
    width: "25%",
  },
  {
    title: "ID size chim",
    dataIndex: "bird_size_id",
    sorter: (a, b) => a.age - b.age,
    width: "5%",
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

const columnsBirdBreed = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.breed_id - b.breed_id,
    width: "10%",
  },
  {
    title: "Giống",
    dataIndex: "breed",
    width: "30%",
  },
  {
    title: "Kích thước",
    dataIndex: "bird_size_id",
    sorter: (a, b) => a.bird_size_id - b.bird_size_id,
    width: "30%",
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
  const [openDetailService, setOpenDetailService] = useState();
  const [openModalCreateBreedBird, setOpenModalCreateBreedBird] = useState();
  const [openModalCreateService, setOpenModalCreateService] = useState();
  const [birdSizeList, setBirdSizeList] = useState();
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [serviceSelected, setServiceSelected] = useState();
  const [servicePackageList, setServicePackageList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [birdBreedList, setBirdBreedList] = useState([]);

  //tab 1
  const [dataService, setDataService] = useState({
    package_name: "",
    price: "",
    description: "",
  });

  const [dataBreed, setDataBreed] = useState({
    breed: "",
    bird_size_id: "",
  });
  const [dataServiceNew, setDataServiceNew] = useState({
    bird_size_id: "",
    service_id: "",
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
  const handleInputBreedChange = (name, value) => {
    console.log("name", name, value);
    setDataBreed((prevDataBreed) => ({
      ...prevDataBreed,
      [name]: value,
    }));
  };
  const handleInputServiceChange = (name, value) => {
    console.log("name", name, value);
    setDataServiceNew((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onChange = (key) => {
    console.log("change me", key);
    setTab(key);
  };

  const onHandleService = (item) => {
    setOpenDetailService(true);
    setServiceSelected(item);
    setDataService({
      package_name: item.package_name,
      price: item.price,
      description: item.description,
    });
    console.log("item", item);
  };

  const onHandleCreateBreedBird = () => {
    setOpenModalCreateBreedBird(true);
  };

  const onHandleCreateService = () => {
    setOpenModalCreateService(true);
  };

  const updateService = async () => {
    try {
      const response = await API.put(
        `/servicePackage/${serviceSelected.service_package_id}`,
        {
          name: dataService.package_name,
          price: dataService.price,
          description: dataService.description,
        }
      );
      if (response) {
        console.log("Change thanh cong");
        message.success(`Update service thành công.`);
        fetchServicePackage();
        fetchServiceType();
      }
    } catch (error) {
      console.log(error);
      message.error(`Update service thất bại.`);
    }
  };

  const fetchBirdBreed = async () => {
    try {
      const response = await API.get(`/bird_breed/`);
      if (response.data) {
        console.log("Data bird breed", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          key: index,
          ...item,
          index: index + 1,
          action: (
            <Button type="default" icon={<EditFilled />} onClick={() => {}}>
              Chỉnh sửa
            </Button>
          ),
        }));
        setBirdBreedList(dataAfterMap);
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
        const filterArray = response.data.filter(
          (item) => item.service_type_id !== "STfake"
        );
        setServiceTypeList(filterArray);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBirdSize = async () => {
    try {
      const response = await API.get(`/bird_size/`);
      if (response.data) {
        console.log("Bird size:", response.data);
        setBirdSizeList(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchService = async () => {
    try {
      const response = await API.get(`/service/`);
      if (response.data) {
        console.log("Service ne:", response.data);
        setServiceList(response.data);
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
        const filterArray = response.data.filter(
          (item) =>
            item.service_package_id !== "SP13" &&
            item.service_package_id !== "SP9"
        );
        const dataAfterMap = filterArray.map((item, index) => ({
          key: index,
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
    fetchBirdBreed();
    fetchBirdSize();
    fetchService();
  }, []);

  useEffect(() => {
    fetchServicePackage();
  }, [tab]);

  return (
    <main className="main-container">
      <h1 style={{color: 'black'}}>Danh sách dịch vụ</h1>
      <Button
        type="primary"
        value="large"
        icon={<BsPersonFillAdd size={20} />}
        onClick={onHandleCreateService}
      >
        Tạo dịch vụ mới
      </Button>
      <Modal
        title="Tạo dịch vụ mới"
        centered
        open={openModalCreateService}
        onOk={() => setOpenModalCreateService(false)}
        onCancel={() => setOpenModalCreateService(false)}
        width={600}
        footer={[
          <Button key="back" onClick={() => setOpenModalCreateService(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              try {
                const response = await API.post(`/servicePackage/`, {
                  bird_size_id: dataServiceNew.bird_size_id,
                  service_id: dataServiceNew.service_id,
                  price: dataServiceNew.price,
                  description: dataServiceNew.description,
                  package_name: dataServiceNew.package_name,
                  status: 1,
                });
                if (response) {
                  console.log("Thêm dv thành công");
                  message.success(`Thêm dv thành công.`);
                }
              } catch (error) {
                console.log(error);
                message.error(`Thêm dv thất bại.`);
              }
            }}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          // disabled={componentDisabled}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Tên dịch vụ">
            <Input
              onChange={(e) =>
                handleInputServiceChange("package_name", e.target.value)
              }
              name="package_name"
              value={dataServiceNew.package_name}
            />
          </Form.Item>
          <Form.Item label="Size chim">
            <Select
              onChange={(value) =>
                handleInputServiceChange("bird_size_id", value)
              }
              name="bird_size_id"
              value={dataServiceNew.bird_size_id}
            >
              {birdSizeList &&
                birdSizeList.length > 0 &&
                birdSizeList.map((item, index) => (
                  <Select.Option
                    value={item.bird_size_id}
                    key={item.bird_size_id}
                  >
                    {item.size}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Gói">
            <Select
              onChange={(value) =>
                handleInputServiceChange("service_id", value)
              }
              name="service_id"
              value={dataServiceNew.service_id}
            >
              {serviceList &&
                serviceList.length > 0 &&
                serviceList.map((item, index) => (
                  <Select.Option value={item.service_id} key={item.service_id}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Giá">
            <Input
              onChange={(e) =>
                handleInputServiceChange("price", e.target.value)
              }
              name="breed"
              value={dataServiceNew.price}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input
              onChange={(e) =>
                handleInputServiceChange("description", e.target.value)
              }
              name="breed"
              value={dataServiceNew.description}
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thông tin chi tiết dịch vụ"
        centered
        open={openDetailService}
        onOk={() => {
          updateService();
          setOpenDetailService(false);
        }}
        onCancel={() => setOpenDetailService(false)}
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
      <h1 style={{color: 'black'}}>Danh sách giống chim</h1>
      <Button
        type="primary"
        value="large"
        icon={<BsPersonFillAdd size={20} />}
        onClick={onHandleCreateBreedBird}
      >
        Tạo giống chim mới
      </Button>
      <Modal
        title="Tạo giống chim mới"
        centered
        open={openModalCreateBreedBird}
        onOk={() => setOpenModalCreateBreedBird(false)}
        onCancel={() => setOpenModalCreateBreedBird(false)}
        width={600}
        footer={[
          <Button key="back" onClick={() => setOpenModalCreateBreedBird(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              try {
                const response = await API.post(`/bird_breed/`, {
                  breed: dataBreed.breed,
                  bird_size_id: dataBreed.bird_size_id,
                });
                if (response) {
                  console.log("Thêm giống thành công");
                  message.success(`Thêm giống thành công.`);
                }
              } catch (error) {
                console.log(error);
                message.error(`Thêm giống thất bại.`);
              }
            }}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          // disabled={componentDisabled}
          style={{
            maxWidth: 600,
          }}
        >
          <Form.Item label="Tên giống">
            <Input
              onChange={(e) => handleInputBreedChange("breed", e.target.value)}
              name="breed"
              value={dataBreed.breed}
            />
          </Form.Item>
          <Form.Item label="Size chim">
            <Select
              onChange={(value) =>
                handleInputBreedChange("bird_size_id", value)
              }
              name="bird_size_id"
              value={dataBreed.bird_size_id}
            >
              {birdSizeList &&
                birdSizeList.length > 0 &&
                birdSizeList.map((item, index) => (
                  <Select.Option
                    value={item.bird_size_id}
                    key={item.bird_size_id}
                  >
                    {item.size}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        columns={columnsBirdBreed}
        dataSource={birdBreedList}
        onChange={onChange}
      />
    </main>
  );
};

export default Service;
