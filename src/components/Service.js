import React, { useState, useEffect } from "react";
import { Button, Flex, Form, Input, Select, Upload } from "antd";
import { Table } from "antd";
import styles from "./Service.module.scss";
import { EditFilled } from "@ant-design/icons";
import { BsPlusCircleFill } from "react-icons/bs";
import { Tabs, Modal, message } from "antd";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";

import createAxios from "../services/axios";
const API = createAxios();
// Định dạng tổng tiền theo tiền tệ Việt Nam
const formattedPrice = (price) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
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
    render: (price) => formattedPrice(price),
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
const columnsService = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
    width: "10%",
  },
  {
    title: "Tên dịch vụ",
    dataIndex: "name",
    sorter: (a, b) => a.age - b.age,
    width: "25%",
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
    dataIndex: "bird_size",
    render: (bird_size) => <div>{bird_size.size}</div>,
    sorter: (a, b) => a.bird_size_id - b.bird_size_id,
    width: "30%",
  },
  {
    title: "Hành động",
    dataIndex: "action",
    width: "10%",
  },
];
const columnsMedicine = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.breed_id - b.breed_id,
    width: "10%",
  },
  {
    title: "Tên",
    dataIndex: "name",
    width: "30%",
  },
  {
    title: "Đơn vị",
    dataIndex: "unit",
    sorter: (a, b) => a.bird_size_id - b.bird_size_id,
    width: "10%",
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    sorter: (a, b) => a.bird_size_id - b.bird_size_id,
    width: "15%",
  },
  {
    title: "HDSD",
    dataIndex: "usage",
    width: "15%",
  },
  {
    title: "Tác dụng phụ",
    dataIndex: "sideEffects",
    width: "10%",
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
  const [openDetailBirdBreed, setOpenDetailBirdBreed] = useState();
  const [openDetailService, setOpenDetailService] = useState();
  const [openDetailMedicine, setOpenDetailMedicine] = useState();
  const [openDetailServicePackage, setOpenDetailServicePackage] = useState();
  const [openModalCreateMedicine, setOpenModalCreateMedicine] = useState();
  const [openModalCreateBreedBird, setOpenModalCreateBreedBird] = useState();
  const [openModalCreateService, setOpenModalCreateService] = useState();
  const [openModalCreateServicePackage, setOpenModalCreateServicePackage] =
    useState();
  const [loading, setLoading] = useState(false);

  const [medicineList, setMedicineList] = useState();
  const [birdSizeList, setBirdSizeList] = useState();
  const [serviceTypeList, setServiceTypeList] = useState([]);
  const [serviceSelected, setServiceSelected] = useState();
  const [servicePackageSelected, setServicePackageSelected] = useState();
  const [servicePackageList, setServicePackageList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [birdBreedList, setBirdBreedList] = useState([]);
  const [birdBreedSelected, setBirdBreedSelected] = useState([]);
  const [medicineSelected, setMedicineSelected] = useState();

  const [imageUrl, setImageUrl] = useState();
  const [imageService, setImageService] = useState([]);

  //tab 1
  const [dataService, setDataService] = useState({
    name: "",
    description: "",
  });
  const [dataServicePackage, setDataServicePackage] = useState({
    package_name: "",
    price: "",
    description: "",
  });

  const [dataBreed, setDataBreed] = useState({
    breed: "",
    bird_size_id: "",
  });
  const [dataMedicineEdit, setDataMedicineEdit] = useState({
    name: "",
    unit: "",
    usage: "",
    description: "",
    sideEffects: "",
  });
  const [dataMedicineNew, setDataMedicineNew] = useState({
    name: "",
    unit: "",
    usage: "",
    description: "",
    sideEffects: "",
  });
  const [dataBreedNew, setDataBreedNew] = useState({
    breed: "",
    bird_size_id: "",
  });
  const [dataServiceNew, setDataServiceNew] = useState({
    service_type_id: "",
    name: "",
    description: "",
  });
  const [dataServicePackageNew, setDataServicePackageNew] = useState({
    bird_size_id: "",
    service_id: "",
    package_name: "",
    price: "",
    description: "",
  });

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    setDataService((dataService) => ({
      ...dataService,
      [name]: value,
    }));
  };
  const handleInputChange2 = (e) => {
    const { name, value } = e.target;

    setDataServicePackage((dataServicePackage) => ({
      ...dataServicePackage,
      [name]: value,
    }));
  };
  const handleInputMedicine = (e) => {
    const { name, value } = e.target;

    setDataMedicineEdit((dataMedicineEdit) => ({
      ...dataMedicineEdit,
      [name]: value,
    }));
    setDataMedicineNew((dataMedicineNew) => ({
      ...dataMedicineNew,
      [name]: value,
    }));
  };

  const handleInputBreedChange = (name, value) => {
    console.log("name", name, value);
    setDataBreed((prevDataBreed) => ({
      ...prevDataBreed,
      [name]: value,
    }));
    setDataBreedNew((prevDataBreed) => ({
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
  const handleInputServicePackageChange = (name, value) => {
    console.log("name", name, value);
    setDataServicePackageNew((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onChange = (key) => {
    console.log("change me", key);
    setTab(key);
  };

  const onHandleBirdBreed = (item) => {
    setOpenDetailBirdBreed(true);
    setBirdBreedSelected(item);
    setDataBreed({
      breed: item.breed,
      bird_size_id: item.bird_size_id,
    });
    console.log("item", item);
  };
  const onHandleService = (item) => {
    setOpenDetailService(true);
    setServiceSelected(item);
    setDataService({
      name: item.name,
      description: item.description,
    });
  };
  const onHandleServicePackage = (item) => {
    setOpenDetailServicePackage(true);
    setServicePackageSelected(item);
    setDataServicePackage({
      package_name: item.package_name,
      price: item.price,
      description: item.description,
    });
    console.log("item", item);
  };
  const onHandleEditMedicine = (item) => {
    setOpenDetailMedicine(true);
    setMedicineSelected(item);
    setDataMedicineEdit({
      name: item.name,
      unit: item.unit,
      description: item.description,
      usage: item.usage,
      sideEffects: item.sideEffects,
    });
    console.log("detail thuoc ne", item);
  };

  const onHandleCreateBreedBird = () => {
    setOpenModalCreateBreedBird(true);
  };

  const onHandleCreateService = () => {
    setOpenModalCreateService(true);
  };
  const onHandleCreateServicePackage = () => {
    setOpenModalCreateServicePackage(true);
  };

  const updateBreed = async () => {
    console.log("breed", dataBreed.breed);
    console.log("birdsizeid", dataBreed.bird_size_id);
    try {
      const response = await API.put(
        `/bird-breed/${birdBreedSelected.breed_id}`,
        {
          breed: dataBreed.breed,
          bird_size_id: dataBreed.bird_size_id,
        }
      );
      if (response) {
        console.log("Change thanh cong");
        message.success(`Update giống chim thành công.`);
        fetchBirdBreed();
        // fetchServiceType();
      }
    } catch (error) {
      console.log(error);
      message.error(`Update giống chim thất bại.`);
    }
  };
  const updateService = async () => {
    try {
      const response = await API.put(`/service/${serviceSelected.service_id}`, {
        name: dataService.name,
        description: dataService.description,
      });
      if (response) {
        console.log("Change thanh cong");
        message.success(`Update service thành công.`);
        fetchService();
        // fetchServiceType();
      }
    } catch (error) {
      console.log(error);
      message.error(`Update service thất bại.`);
    }
  };
  const updateServicePackage = async () => {
    try {
      const response = await API.put(
        `/service-package/${servicePackageSelected.service_package_id}`,
        {
          package_name: dataServicePackage.package_name,
          price: dataServicePackage.price,
          description: dataServicePackage.description,
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
  const updateMedicine = async () => {
    try {
      const response = await API.put(
        `/medicine/${medicineSelected.medicine_id}`,
        {
          name: dataMedicineEdit.name,
          unit: dataMedicineEdit.price,
          description: dataMedicineEdit.description,
          usage: dataMedicineEdit.usage,
          sideEffects: dataMedicineEdit.sideEffects,
        }
      );
      if (response) {
        console.log("Change thanh cong");
        message.success(`Cập nhật thuốc thành công.`);
        fetchMedicine();
      }
    } catch (error) {
      console.log(error);
      message.error(`Update service thất bại.`);
    }
  };

  const fetchBirdBreed = async () => {
    try {
      const response = await API.get(`/bird-breed/`);
      if (response.data) {
        console.log("Data bird breed", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          key: index,
          ...item,
          index: index + 1,
          action: (
            <Button
              type="default"
              icon={<EditFilled />}
              onClick={() => {
                onHandleBirdBreed(item);
              }}
            >
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
      const response = await API.get(`/service-type/`);
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
      const response = await API.get(`/bird-size/`);
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
        const dataAfterMap = response.data.map((item, index) => ({
          key: index,
          ...item,
          index: index + 1,
          action: (
            <Button
              type="default"
              icon={<EditFilled />}
              onClick={() => {
                onHandleService(item);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        }));
        setServiceList(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchServicePackage = async () => {
    try {
      const response = await API.get(
        `/service-package/?service_type_id=${tab}`
      );
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
              onClick={() => onHandleServicePackage(item)}
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

  const fetchMedicine = async () => {
    try {
      const response = await API.get(`/medicine/`);
      if (response.data) {
        console.log("Medicine ne:", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          key: index,
          ...item,
          index: index + 1,
          action: (
            <Button
              type="default"
              icon={<EditFilled />}
              onClick={() => {
                onHandleEditMedicine(item);
              }}
            >
              Chỉnh sửa
            </Button>
          ),
        }));
        setMedicineList(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Tải lên
      </div>
    </div>
  );

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      message.success("Tải lên file ảnh thành công!");
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) setImageService([file]);

    return isJpgOrPng && isLt2M;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  useEffect(() => {
    fetchServiceType();
    fetchBirdBreed();
    fetchBirdSize();
    fetchService();
    fetchMedicine();
  }, []);

  useEffect(() => {
    fetchServicePackage();
  }, [tab]);

  return (
    <main className="main-container">
      <div className={styles.top}>
        <h2 style={{ color: "black" }}>DANH SÁCH DỊCH VỤ</h2>
        <Button type="primary" size="large" onClick={onHandleCreateService}>
          Thêm dịch vụ mới
        </Button>
        {/* MODAL CHINH SUA DICH VU  */}
        <Modal
          title="Chỉnh sửa dịch vụ"
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
                    name="name"
                    value={dataService.name}
                    onChange={handleInputChange1}
                  />
                </td>
              </tr>
              <tr>
                <th>Mô tả</th>
                <td>
                  <input
                    type="text"
                    name="description"
                    value={dataService.description}
                    onChange={handleInputChange1}
                  />{" "}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal>
      </div>
      <Table
        columns={columnsService}
        dataSource={serviceList}
        onChange={onChange}
      />
      <div className={styles.top} style={{ marginTop: 40 }}>
        <h2 style={{ color: "black" }}>DANH SÁCH GÓI DỊCH VỤ</h2>
        <Button
          type="primary"
          size="large"
          icon={<BsPlusCircleFill size={23} />}
          style={{ display: "flex", alignItems: "center" }}
          onClick={onHandleCreateServicePackage}
        >
          Thêm gói dịch vụ mới
        </Button>
      </div>
      <Modal
        title="Thêm gói dịch vụ mới"
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
              console.log("service_type_id", dataServiceNew.service_type_id);
              console.log("name", dataServiceNew.name);
              console.log("desc", dataServiceNew.description);

              try {
                const responseCreateService = await API.post(`/service/`, {
                  service_type_id: dataServiceNew.service_type_id,
                  name: dataServiceNew.name,
                  description: dataServiceNew.description,
                  status: 1,
                });
                if (responseCreateService) {
                  console.log(
                    "Create service success ?",
                    responseCreateService.data
                  );
                  const formDataService = new FormData();
                  formDataService.append("image", imageService[0]);
                  formDataService.append(
                    "service_type_id",
                    dataServiceNew.service_type_id
                  );
                  formDataService.append("name", dataServiceNew.name);
                  formDataService.append(
                    "description",
                    dataServiceNew.description
                  );
                  formDataService.append("status", "1");

                  const responseCreate = await API.postWithHeaders(
                    `/service/`,
                    formDataService,
                    {
                      "Content-Type": "multipart/form-data",
                    }
                  );
                  if (responseCreate.data) {
                    console.log("Thêm dv thành công");
                    message.success(`Thêm dv thành công.`);
                    fetchService();
                  } else {
                    message.error("Tạo tài khoản bác sĩ thất bại!");
                  }
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
          <Form.Item label="Loại dịch vụ">
            <Select
              onChange={(value) =>
                handleInputServiceChange("service_type_id", value)
              }
              name="service_type_id"
              value={dataServiceNew.service_type_id}
            >
              {serviceTypeList &&
                serviceTypeList.length > 0 &&
                serviceTypeList.map((item, index) => (
                  <Select.Option
                    value={item.service_type_id}
                    key={item.service_type_id}
                  >
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Tên dịch vụ">
            <Input
              onChange={(e) => handleInputServiceChange("name", e.target.value)}
              name="ame"
              value={dataServiceNew.name}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input
              onChange={(e) =>
                handleInputServiceChange("description", e.target.value)
              }
              name="description"
              value={dataServiceNew.description}
            />
          </Form.Item>
          <Form.Item
            label="Hình ảnh"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              beforeUpload={beforeUpload}
              imageDoctor
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    width: "100%",
                  }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Thêm gói dịch vụ mới"
        centered
        open={openModalCreateServicePackage}
        onOk={() => setOpenModalCreateServicePackage(false)}
        onCancel={() => setOpenModalCreateServicePackage(false)}
        width={600}
        footer={[
          <Button
            key="back"
            onClick={() => setOpenModalCreateServicePackage(false)}
          >
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={async () => {
              try {
                const response = await API.post(`/service-package/`, {
                  bird_size_id: dataServicePackageNew.bird_size_id,
                  service_id: dataServicePackageNew.service_id,
                  price: dataServicePackageNew.price,
                  description: dataServicePackageNew.description,
                  package_name: dataServicePackageNew.package_name,
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
                handleInputServicePackageChange("package_name", e.target.value)
              }
              name="package_name"
              value={dataServicePackageNew.package_name}
            />
          </Form.Item>
          <Form.Item label="Size chim">
            <Select
              onChange={(value) =>
                handleInputServicePackageChange("bird_size_id", value)
              }
              name="bird_size_id"
              value={dataServicePackageNew.bird_size_id}
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
                handleInputServicePackageChange("service_id", value)
              }
              name="service_id"
              value={dataServicePackageNew.service_id}
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
                handleInputServicePackageChange("price", e.target.value)
              }
              name="breed"
              value={dataServicePackageNew.price}
            />
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input
              onChange={(e) =>
                handleInputServicePackageChange("description", e.target.value)
              }
              name="breed"
              value={dataServicePackageNew.description}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* UPDATE SERVICE PACKAGE  */}
      <Modal
        title="Chỉnh sửa gói dịch vụ"
        centered
        open={openDetailServicePackage}
        onOk={() => {
          updateServicePackage();
          setOpenDetailServicePackage(false);
        }}
        onCancel={() => setOpenDetailServicePackage(false)}
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
                  value={dataServicePackage.package_name}
                  onChange={handleInputChange2}
                />
              </td>
            </tr>
            <tr>
              <th>Giá tiền</th>
              <td>
                <input
                  type="text"
                  name="price"
                  value={dataServicePackage.price}
                  onChange={handleInputChange2}
                />
              </td>
            </tr>
            <tr>
              <th>Mô tả</th>
              <td>
                <input
                  type="text"
                  name="description"
                  value={dataServicePackage.description}
                  onChange={handleInputChange2}
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
      <div className={styles.top} style={{ marginTop: 40, width: "50%" }}>
        <h2 style={{ color: "black" }}>DANH SÁCH GIỐNG CHIM</h2>
        <Button type="primary" size="large" onClick={onHandleCreateBreedBird}>
          Tạo giống chim mới
        </Button>
        <Modal
          title="Chỉnh sửa giống chim"
          centered
          open={openDetailBirdBreed}
          onOk={() => {
            updateBreed();
            setOpenDetailBirdBreed(false);
          }}
          onCancel={() => setOpenDetailBirdBreed(false)}
          width={500}
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
        </Modal>
        <Modal
          title="Tạo giống chim mới"
          centered
          open={openModalCreateBreedBird}
          onOk={() => setOpenModalCreateBreedBird(false)}
          onCancel={() => setOpenModalCreateBreedBird(false)}
          width={600}
          footer={[
            <Button
              key="back"
              onClick={() => setOpenModalCreateBreedBird(false)}
            >
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={async () => {
                try {
                  const response = await API.post(`/bird-breed/`, {
                    breed: dataBreedNew.breed,
                    bird_size_id: dataBreedNew.bird_size_id,
                  });
                  if (response) {
                    console.log("Thêm giống thành công");
                    message.success(`Thêm giống thành công.`);
                    fetchBirdBreed();
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
                onChange={(e) =>
                  handleInputBreedChange("breed", e.target.value)
                }
                name="breed"
                value={dataBreedNew.breed}
              />
            </Form.Item>
            <Form.Item label="Size chim">
              <Select
                onChange={(value) =>
                  handleInputBreedChange("bird_size_id", value)
                }
                name="bird_size_id"
                value={dataBreedNew.bird_size_id}
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
      </div>
      <div style={{ width: "50%" }}>
        <Table
          columns={columnsBirdBreed}
          dataSource={birdBreedList}
          onChange={onChange}
        />
      </div>
      <div className={styles.top} style={{ marginTop: 40 }}>
        <h2 style={{ color: "black" }}>DANH SÁCH THUỐC</h2>
        <Button
          type="primary"
          size="large"
          onClick={() => setOpenModalCreateMedicine(true)}
        >
          Tạo thuốc mới
        </Button>
        <Modal
          title="Chỉnh sửa thuốc"
          centered
          open={openDetailMedicine}
          onOk={() => {
            updateMedicine();
            setOpenDetailMedicine(false);
          }}
          onCancel={() => setOpenDetailMedicine(false)}
          width={500}
        >
          <Form
            labelCol={{
              span: 6,
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
            <Form.Item label="Tên thuốc">
              <Input
                onChange={handleInputMedicine}
                name="name"
                value={dataMedicineEdit.name}
              />
            </Form.Item>
            <Form.Item label="Đơn vị">
              <Input
                onChange={handleInputMedicine}
                name="unit"
                value={dataMedicineEdit.unit}
              />
            </Form.Item>
            <Form.Item label="Mô tả">
              <Input
                onChange={handleInputMedicine}
                name="description"
                value={dataMedicineEdit.description}
              />
            </Form.Item>
            <Form.Item label="HDSD">
              <Input
                onChange={handleInputMedicine}
                name="usage"
                value={dataMedicineEdit.usage}
              />
            </Form.Item>
            <Form.Item label="Tác dụng phụ">
              <Input
                onChange={handleInputMedicine}
                name="sideEffects"
                value={dataMedicineEdit.sideEffects}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Tạo thuốc mới"
          centered
          open={openModalCreateMedicine}
          onOk={() => setOpenModalCreateMedicine(false)}
          onCancel={() => setOpenModalCreateMedicine(false)}
          width={600}
          footer={[
            <Button
              key="back"
              onClick={() => setOpenModalCreateMedicine(false)}
            >
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={async () => {
                try {
                  const response = await API.post(`/medicine/`, {
                    name: dataMedicineNew.name,
                    unit: dataMedicineNew.price,
                    description: dataMedicineNew.description,
                    usage: dataMedicineNew.usage,
                    sideEffects: dataMedicineNew.sideEffects,
                  });
                  if (response) {
                    console.log("Thêm thuốc thành công");
                    message.success(`Thêm thuốc thành công.`);
                    fetchMedicine();
                  }
                } catch (error) {
                  console.log(error);
                  message.error(`Thêm thuốc thất bại.`);
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
            <Form.Item label="Tên thuốc">
              <Input
                onChange={handleInputMedicine}
                name="name"
                value={dataMedicineNew.name}
              />
            </Form.Item>
            <Form.Item label="Đơn vị">
              <Input
                onChange={handleInputMedicine}
                name="unit"
                value={dataMedicineNew.unit}
              />
            </Form.Item>
            <Form.Item label="Mô tả">
              <Input
                onChange={handleInputMedicine}
                name="description"
                value={dataMedicineNew.description}
              />
            </Form.Item>
            <Form.Item label="HDSD">
              <Input
                onChange={handleInputMedicine}
                name="usage"
                value={dataMedicineNew.usage}
              />
            </Form.Item>
            <Form.Item label="Tác dụng phụ">
              <Input
                onChange={handleInputMedicine}
                name="sideEffects"
                value={dataMedicineNew.sideEffects}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <Table
          columns={columnsMedicine}
          dataSource={medicineList}
          onChange={onChange}
        />
      </div>
    </main>
  );
};

export default Service;
