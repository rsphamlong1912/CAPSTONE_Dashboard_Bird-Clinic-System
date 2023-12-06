import React, { useState, useEffect } from "react";
import styles from "./Slot.module.scss";
import { InboxOutlined } from "@ant-design/icons";
import {
  message,
  Upload,
  Button,
  Tabs,
  Card,
  DatePicker,
  Avatar,
  Modal,
  Col,
  Row,
} from "antd";

import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import createAxios from "../services/axios";
const API = createAxios();

const { Meta } = Card;
const { Dragger } = Upload;
const gridStyle = {
  width: "25%",
};

const Slot = () => {
  const [fileList, setFileList] = useState([]);
  const [dataSlotClinic, setDataSlotClinic] = useState([]);
  const [dataVet, setDataVet] = useState([]);
  const [datePicked, setDatePicked] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [doctorPicked, setDoctorPicked] = useState();
  const [dataVetSlot, setDataVetSlot] = useState([]);

  const props = {
    name: "file",
    multiple: false,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    beforeUpload(file) {
      setFileList([file]);
    },
    fileList,
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file upload thành công.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload thất bại.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    onRemove: () => {
      setFileList([]);
    },
  };

  const handleUploadFileTimeSlot = async () => {
    try {
      console.log("FileList:", fileList[0]);
      const formData = new FormData();
      formData.append("excelFile", fileList[0]);

      const response = await API.postWithHeaders(
        `/time-slot-clinic/with-file`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response) {
        console.log(response);
        setFileList([]);
        message.success(`Cập nhật lịch khám cho bác sĩ thành công.`);
      }
    } catch (error) {
      console.log(error);
      message.error(`Cập nhật lịch phòng khám thất bại.`);
    }
  };

  const fetchDataSlotClinic = async () => {
    try {
      const response = await API.get(`/slot-clinic/`);
      if (response.data) {
        console.log("Data slot clinic", response.data);
        const arrayAfterSort = response.data.sort(
          (a, b) => a.slot_clinic_id - b.slot_clinic_id
        );
        setDataSlotClinic(arrayAfterSort);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataSlotByVetAndDate = async () => {
    setDataVetSlot([]);
    try {
      const response = await API.get(
        `/veterinarian-slot-detail/?veterinarian_id=${doctorPicked.veterinarian_id}&date=${datePicked}`
      );
      if (response.data) {
        console.log("Data slot by Vet and Date", response.data);
        setDataVetSlot(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataVetByDate = async () => {
    setDataVet([]);
    try {
      const response = await API.get(`/vet/?date=${datePicked}`);
      if (response.data) {
        console.log("Data vet by Date", response.data);
        setDataVet(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataSlotClinic();
  }, []);

  const handleUploadFileVetSlot = async () => {
    try {
      console.log("FileList:", fileList[0]);
      const formData = new FormData();
      formData.append("excelFile", fileList[0]);

      const response = await API.postWithHeaders(
        `/veterinarian-slot-detail/with-file`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (response) {
        console.log(response);
        setFileList([]);
        message.success(`Cập nhật lịch phòng khám thành công.`);
      }
    } catch (error) {
      console.log(error);
      message.error(`Cập nhật lịch khám bác sĩ thất bại.`);
    }
  };

  const onChange = (key) => {
    setFileList([]);
  };

  useEffect(() => {
    if (datePicked) fetchDataVetByDate();
  }, [datePicked]);

  useEffect(() => {
    if (datePicked) fetchDataSlotByVetAndDate();
  }, [doctorPicked]);

  const onChangeDate = (date, dateString) => {
    console.log("Date String: ", dateString);
    setDatePicked(dateString);
  };

  const itemTabs = [
    {
      key: "1",
      label: "Lịch khám",
      children: (
        <>
          <DatePicker
            size="large"
            onChange={onChangeDate}
            placeholder="Chọn ngày"
          />
          <Card
            title={`Danh sách bác sĩ làm việc trong ngày ${datePicked || ""}`}
            style={{ marginTop: 16 }}
          >
            {dataVet.length !== 0 ? (
              dataVet.map((item, index) => (
                <Card.Grid
                  style={gridStyle}
                  key={index}
                  onClick={() => {
                    setDoctorPicked(item);
                    setOpenModal(true);
                  }}
                >
                  <Meta
                    avatar={<Avatar size={60} src={item.veterinarian.image} />}
                    title={item.veterinarian.name}
                    description={item.veterinarian.specialized}
                  />
                </Card.Grid>
              ))
            ) : (
              <h3>Không có bác sĩ làm việc trong ngày này</h3>
            )}
          </Card>
          <Modal
            title={`SLOT KHÁM CỦA BÁC SĨ`}
            centered
            open={openModal}
            onOk={() => setOpenModal(false)}
            onCancel={() => setOpenModal(false)}
            width={1000}
          >
            <div
              style={{
                width: "50%",
                marginTop: 20,
                minHeight: 300,
              }}
            >
              <h3>
                Bác sĩ {doctorPicked ? doctorPicked.veterinarian.name : ""},{" "}
                {datePicked}
              </h3>
              <Row gutter={[26, 20]}>
                {dataVetSlot.length !== 0 &&
                  dataVetSlot.map((item, index) => (
                    <Col span={6} key={index}>
                      <Button
                        size="large"
                        type="default"
                        disabled={item.status === "un_available" ? true : false}
                      >
                        {item.time_slot_clinic_id === null
                          ? "Bác sĩ làm việc cả ngày"
                          : item.time_slot_clinic.slot_clinic.time}
                      </Button>
                    </Col>
                  ))}
              </Row>
            </div>
          </Modal>
        </>
      ),
    },
    {
      key: "2",
      label: "Cập nhật lịch phòng khám",
      children: (
        <>
          <Dragger {...props} style={{ height: "30%" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Chọn hoặc kéo thả file lịch phòng khám vào đây để Update
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 16,
              backgroundColor: "#32b768",
            }}
            onClick={() => handleUploadFileTimeSlot()}
          >
            Xác nhận
          </Button>
        </>
      ),
    },
    {
      key: "3",
      label: "Cập nhật lịch khám bác sĩ",
      children: (
        <>
          <Dragger {...props} style={{ height: "30%" }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Chọn hoặc kéo thả file lịch khám bác sĩ vào đây để Update
            </p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from
              uploading company data or other banned files.
            </p>
          </Dragger>
          <Button
            type="primary"
            size="large"
            style={{
              marginTop: 16,
              backgroundColor: "#32b768",
            }}
            onClick={() => handleUploadFileVetSlot()}
          >
            Xác nhận
          </Button>
        </>
      ),
    },
    {
      key: "4",
      label: "Cập nhật slot khám",
      children: (
        <>
          <Card title="Slot phòng khám">
            {dataSlotClinic.length !== 0 &&
              dataSlotClinic.map((item, index) => (
                <Card.Grid style={gridStyle}>{item.time}</Card.Grid>
              ))}
          </Card>
        </>
      ),
    },
  ];

  return (
    <main className="main-container">
      <h1 style={{ color: "#111", marginBottom: 30 }}>LỊCH KHÁM</h1>
      <div>
        <Tabs onChange={onChange} type="card" items={itemTabs} />
      </div>
    </main>
  );
};

export default Slot;
