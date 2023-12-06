import React, { useState, useEffect } from "react";
import { Button } from "antd";
import {
  Table,
  Modal,
  Tabs,
  Checkbox,
  Form,
  Input,
  Radio,
  Upload,
  message,
  Row,
} from "antd";
import styles from "./Vet.module.scss";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { BsPersonFillAdd } from "react-icons/bs";

import createAxios from "../services/axios";
const API = createAxios();

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const columns = [
  {
    title: "STT",
    dataIndex: "index",
    sorter: (a, b) => a.index - b.index,
    width: "5%",
  },
  {
    title: "Họ tên",
    dataIndex: "name",
    width: "20%",
  },
  {
    title: "Chuyên môn",
    dataIndex: "specialized",
    width: "10%",
  },
  {
    title: "Dịch vụ",
    dataIndex: "vet_service_catalogs",
    render: (serviceName) => {
      return (
        <span>
          {serviceName.map((item, index) => (
            <span key={index}>
              {item.service_name}
              <br />
            </span>
          ))}
        </span>
      );
    },
    width: "20%",
  },
  {
    title: "Trạng thái",
    dataIndex: "account",
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

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const Vet = () => {
  const [dataVet, setDataVet] = useState([]);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageDoctor, setImageDoctor] = useState([]);

  const [serviceType, setServiceType] = useState("ST001");
  const [dataService, setDataService] = useState();
  const [phone, setPhone] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [email, setEmail] = useState();

  const [isPrimary, setIsPrimary] = useState();
  const [checkedService, setCheckedService] = useState([]);

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
    if (isJpgOrPng && isLt2M) setImageDoctor([file]);

    return isJpgOrPng && isLt2M;
  };

  useEffect(() => {
    console.log("Image", imageDoctor[0]);
  }, [imageDoctor]);

  //////////////////////////////////////
  useEffect(() => {
    console.log("checkedService: ", checkedService);
  }, [checkedService]);

  useEffect(() => {
    if (serviceType === "ST002" || serviceType === "ST003") {
      const allServiceIds = dataService.map((item) => item.value);
      setCheckedService(allServiceIds);
    }
  }, [dataService]);

  useEffect(() => {
    console.log("Input : ", phone + " " + name + " " + email);
  }, [phone, name, email]);
  //////////////////////////////////////

  useEffect(() => {
    if (isPrimary === 1) {
      setCheckedService(["S001"]);
    } else {
      setCheckedService([]);
    }
  }, [isPrimary]);

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

  const formCreateAccount = () => {
    return (
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
        }}
      >
        <Form.Item label="Số điện thoại">
          <Input onChange={(e) => setPhone(e.target.value)} />
        </Form.Item>
        <Form.Item label="Mật khẩu">
          <Input onChange={(e) => setPassword(e.target.value)} />
        </Form.Item>
        <Form.Item label="Họ và Tên">
          <Input onChange={(e) => setName(e.target.value)} />
        </Form.Item>
        <Form.Item label="Email">
          <Input onChange={(e) => setEmail(e.target.value)} />
        </Form.Item>
        {serviceType === "ST001" ? (
          <>
            <Form.Item label="Công việc">
              <Radio.Group onChange={(e) => setIsPrimary(e.target.value)}>
                <Radio value={1}> Bác sĩ chính </Radio>
                <Radio value={0}> Bác sĩ dịch vụ </Radio>
              </Radio.Group>
            </Form.Item>
            {isPrimary === 0 && (
              <Form.Item label="Dịch vụ" name="service" valuePropName="checked">
                <Checkbox.Group
                  options={dataService}
                  onChange={(value) => {
                    setCheckedService(value);
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: "8px",
                    marginTop: "8px",
                  }}
                />
              </Form.Item>
            )}
            {isPrimary === 1 && (
              <Form.Item label="Dịch vụ" name="service" valuePropName="checked">
                <Checkbox value="S001" defaultChecked disabled>
                  Khám tổng quát
                </Checkbox>
              </Form.Item>
            )}
          </>
        ) : (
          <Form.Item label="Dịch vụ" name="service" valuePropName="checked">
            {dataService.map((item, index) => (
              <Row key={index}>
                <Checkbox value={item.value} defaultChecked disabled>
                  {item.label}
                </Checkbox>
              </Row>
            ))}
          </Form.Item>
        )}
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
    );
  };

  const itemTabs = [
    {
      key: "ST001",
      label: "Dịch vụ tổng quát",
      children: <>{formCreateAccount()}</>,
    },
    {
      key: "ST003",
      label: "Dịch vụ nội trú",
      children: <>{formCreateAccount()}</>,
    },
    {
      key: "ST002",
      label: "Dịch vụ spa",
      children: <>{formCreateAccount()}</>,
    },
  ];

  const createVetAccount = async () => {
    try {
      const responseAccount = await API.post(`/account/`, {
        email: email,
        password: password,
        phone: phone,
        role: "vet",
        status: "active",
      });
      if (responseAccount.data) {
        console.log("Create account success ?", responseAccount.data);
        const formDataAccount = new FormData();
        formDataAccount.append("image", imageDoctor[0]);
        formDataAccount.append("account_id", responseAccount.data.account_id);
        formDataAccount.append("specialized", serviceType);
        formDataAccount.append("name", name);
        formDataAccount.append("status", 1);
        formDataAccount.append(
          "is_primary",
          serviceType === "ST002" || serviceType === "ST003" ? 1 : isPrimary
        );
        formDataAccount.append("service_type_id", serviceType);
        formDataAccount.append(
          "arr_service_id",
          JSON.stringify(
            checkedService.map((item) => ({
              veterinarian_id: responseAccount.data.account_id,
              service_id: item,
              veterinarian_name: name,
              service_name:
                isPrimary === 1 && serviceType === "ST001"
                  ? "Khám tổng quát"
                  : dataService.find((itemS) => itemS.value === item).label,
            }))
          )
        );
        for (const value of formDataAccount.values()) {
          console.log("Trong form data: ", value);
        }
        const responseVet = await API.postWithHeaders(
          `/vet/`,
          formDataAccount,
          {
            "Content-Type": "multipart/form-data",
          }
        );
        if (responseVet.data) {
          message.success("Tạo tài khoản cho bác sĩ thành công!");
          setOpen(false);
          setCheckedService([]);
          setName();
          setPassword();
          setEmail();
          setPhone();
          setImageDoctor([]);
          fetchDataVet();
        } else {
          message.error("Tạo tài khoản bác sĩ thất bại!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataVet = async () => {
    try {
      const response = await API.get(`/vet/`);
      if (response.data) {
        console.log("Data Vet", response.data);
        const dataAfterMap = response.data.map((item, index) => ({
          ...item,
          index: index + 1,
          action: <Button icon={<EditOutlined />}>Chỉnh sửa</Button>,
        }));
        setDataVet(dataAfterMap);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataService = async (serviceType) => {
    try {
      const response = await API.get(`/service/`);
      if (response.data) {
        const filterArray = response.data.filter(
          (item) =>
            item.service_type_id === serviceType && item.service_id !== "S001"
        );
        const newArray = filterArray.map((item) => ({
          label: item.name,
          value: item.service_id,
        }));
        setDataService(newArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("Data service: ", dataService);
  }, [dataService]);

  useEffect(() => {
    fetchDataVet();
    fetchDataService(serviceType);
  }, []);

  useEffect(() => {
    if (serviceType) fetchDataService(serviceType);
  }, [serviceType]);

  return (
    <main className="main-container">
      <div className={styles.top}>
        <h1 style={{ color: "black" }}>DANH SÁCH BÁC SĨ</h1>
        <div style={{ backgroundColor: "red", padding: 10 }}>
          <Button
            type="primary"
            value="large"
            style={{}}
            icon={<BsPersonFillAdd />}
            onClick={() => setOpen(true)}
          >
            Tạo tài khoản bác sĩ
          </Button>
        </div>
        <Modal
          title="Tạo tài khoản bác sĩ"
          centered
          open={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
          width={1200}
          footer={[
            <Button key="back" onClick={() => setOpen(false)}>
              Hủy
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                createVetAccount();
              }}
            >
              Xác nhận
            </Button>,
          ]}
        >
          <Tabs
            onChange={(key) => {
              setServiceType(key);
              setImageUrl();
              setImageDoctor([]);
              setIsPrimary();
            }}
            type="card"
            items={itemTabs}
          />
        </Modal>
      </div>
      <Table columns={columns} dataSource={dataVet} onChange={onChange} />
    </main>
  );
};

export default Vet;
