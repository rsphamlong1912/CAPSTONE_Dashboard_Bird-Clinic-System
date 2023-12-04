import React, { useState, useEffect } from "react";
import { Button, Flex } from "antd";
import { Table, Modal, Tabs,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Upload, message, Col, Row } from "antd";
import styles from "./Vet.module.scss";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { BsPersonFillAdd } from "react-icons/bs";

import createAxios from "../services/axios";
const API = createAxios();

const { TextArea } = Input;
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

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
};


const Vet = () => {
  const [dataVet, setDataVet] = useState([]);
  const [open, setOpen] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [imageDoctor, setImageDoctor] = useState([]);

  const [isPrimary, setIsPrimary] = useState();
  const [checkedService, setCheckedService] = useState([]);

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      message.success('Tải lên file ảnh thành công!');
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    if(isJpgOrPng && isLt2M) setImageDoctor([file])

    return isJpgOrPng && isLt2M;
  };

  useEffect(()=>{
    console.log("Image", imageDoctor[0])
  }, [imageDoctor])

  const onChangeCheckedService = (checkedValues) => {
    console.log('checked = ', checkedValues);
    
  };

  useEffect(()=>{
    console.log("isPrimary", checkedService)
  }, [checkedService])

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const dataService = [
    {
      label: 'Chụp X-Quang',
      value: 'S001',
    },
    {
      label: 'Nội soi',
      value: 'S002',
    },
    {
      label: 'Phẫu thuật',
      value: 'S003',
    },
    {
      label: 'Xét nghiệm bệnh truyền nhiễm',
      value: 'S004',
    },
    {
      label: 'Xét nghiệm DNA giới tính',
      value: 'S005',
    },
    {
      label: 'Xét nghiệm máu',
      value: 'S006',
    },
    {
      label: 'Xét nghiệm phân chim',
      value: 'S007',
    },
  ];

  const itemTabs = [
    {
      key: '1',
      label: 'Dịch vụ tổng quát',
      children:  <>
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
        <Form.Item label="Checkbox" name="disabled" valuePropName="checked">
          <Checkbox>Checkbox</Checkbox>
        </Form.Item>
        <Form.Item label="Số điện thoại">
          <Input security="true"/>
        </Form.Item>
        <Form.Item label="Mật khẩu">
          <Input />
        </Form.Item>
        <Form.Item label="Họ và Tên">
          <Input />
        </Form.Item>
        <Form.Item label="Email">
          <Input />
        </Form.Item>
        <Form.Item label="Công việc">
          <Radio.Group onChange={(e)=>setIsPrimary(e.target.value)}>
            <Radio value={1}> Bác sĩ chính </Radio>
            <Radio value={0}> Bác sĩ dịch vụ </Radio>
          </Radio.Group>
        </Form.Item>
        {isPrimary === 0 &&
          <Form.Item label="Dịch vụ" name="service" valuePropName="checked">
          <Checkbox.Group options={dataService} onChange={(value)=>{setCheckedService(value)}}  
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '8px', 
            marginTop: '8px'
          }}/>          
          </Form.Item> 
        }
        {isPrimary === 1 &&
          <Form.Item label="Dịch vụ" name="service" valuePropName="checked">
            <Checkbox value="S00100" defaultChecked disabled>Khám tổng quát</Checkbox>
          </Form.Item>
        }
        {/* <Form.Item label="InputNumber">
          <InputNumber />
        </Form.Item>
        <Form.Item label="TextArea">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item label="Switch" valuePropName="checked">
          <Switch />
        </Form.Item> */}
        <Form.Item label="Hình ảnh" valuePropName="fileList" getValueFromEvent={normFile}>
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
              width: '100%',
            }}
          />
        ) : (
          uploadButton
        )}
      </Upload>
        </Form.Item>
        <Form.Item label="Button">
          <Button>Button</Button>
        </Form.Item>
      </Form>
    </>,
    },
    {
      key: '2',
      label: 'Dịch vụ nội trú',
      children:  <>
      <span>Dịch vụ nội trú</span>
    </>,
    },
    {
      key: '3',
      label: 'Dịch vụ spa',
      children: 
          <span>Dịch vụ spa</span>
    },
  ];



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
    <div className={styles.top}>
    <h1>Danh sách tài khoản</h1>
    <Button type="primary" value="large" icon={<BsPersonFillAdd  size={20}/>}  onClick={() => setOpen(true)} >Tạo tài khoản bác sĩ</Button>
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
            onClick={() => {}}
          >
            Xác nhận
          </Button>,
        ]}
      >
       {/* <Button type="default" value="large" onClick={() => {}}>Dịch vụ khám tổng quát</Button>
       <Button type="default" value="large" onClick={() => {}}>Dịch vụ nội trú</Button>
       <Button type="default" value="large" onClick={() => {}}>Dịch vụ spa làm đẹp</Button> */}
        <Tabs
          // onChange={onChange}
          type="card"
          items={itemTabs}
        />
      </Modal>
    </div>
      <Table columns={columns} dataSource={dataVet} onChange={onChange} />
  </div>
  )
};

export default Vet;
