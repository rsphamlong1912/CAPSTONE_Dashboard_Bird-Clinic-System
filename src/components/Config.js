import React, { useState, useEffect } from "react";
import styles from "./Config.module.scss";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IoBedOutline, IoTimeOutline, IoTimerOutline } from "react-icons/io5";
import { Card, Button, Modal, Input, message } from "antd";
import createAxios from "../services/axios";
const API = createAxios();

const { Meta } = Card;
const gridStyle = {
  width: "10%",
  textAlign: "center",
};

const Config = () => {
  const [dateBoardingConfig, setDateBoardingConfig] = useState();
  const [dataSlotClinic, setDataSlotClinic] = useState([]);
  const [timeSlot, setTimeSlot] = useState({
    slot_clinic_id: "",
    time: "",
  });
  const [newTime, setNewTime] = useState();

  const [modalOpen, setModalOpen] = useState();
  const [date, setDate] = useState();

  const fetchDataBoardingConfig = async () => {
    try {
      const response = await API.get(`/config/`);
      if (response.data) {
        console.log("Data Config", response.data);
        setDateBoardingConfig(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateBoardingConfig = async () => {
    try {
      const response = await API.put(
        `/config/?key=at_least_day_boarding&value=${date}`
      );
      if (response.data) {
        console.log("Data Config post trả về", response.data);
        setDateBoardingConfig(response.data);
        message.success(`Cập nhật số ngày tối thiểu thành công.`);
        setModalOpen(null);
        fetchDataBoardingConfig();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataSlotClinic = async () => {
    try {
      const response = await API.get(`/slot_clinic/`);
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

  const updateSlotClinic = async () => {
    try {
      const response = await API.put(
        `/slot_clinic/${timeSlot.slot_clinic_id}`,
        { time: timeSlot.time }
      );
      if (response.data) {
        console.log("Data update slot clinic", response.data);
        setModalOpen(null);
        fetchDataSlotClinic();
        message.success(`Cập nhật slot thành công.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addSlotClinic = async () => {
    try {
      const response = await API.post(`/slot_clinic/`, { time: newTime });
      if (response.data) {
        console.log("Data add slot clinic", response.data);
        setModalOpen(null);
        fetchDataSlotClinic();
        message.success(`Thêm slot thành công.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataBoardingConfig();
    fetchDataSlotClinic();
  }, []);

  useEffect(() => {
    console.log("Time slot: ", timeSlot);
  }, [timeSlot]);

  return (
    <main className="main-container">
      <h1 style={{ color: "black" }}>CẤU HÌNH</h1>
      <Card
        style={{
          width: 400,
        }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined
            key="edit"
            onClick={() => setModalOpen("changeNumberBoarding")}
          />,
          <EllipsisOutlined key="ellipsis" />,
        ]}
      >
        <div>
          <Meta
            avatar={<IoBedOutline size={60} />}
            title="Nội trú"
            description="Số ngày tối thiểu"
          />
          <Button
            style={{ position: "absolute", right: 20, top: 20 }}
            size="large"
            type="primary"
            shape="round"
          >
            {dateBoardingConfig
              ? dateBoardingConfig.at_least_day_boarding
              : "   "}{" "}
            ngày
          </Button>
        </div>
      </Card>
      <Card
        title="Slot phòng khám"
        extra={
          <Button type="primary" onClick={() => setModalOpen("addSlotClinic")}>
            Tạo slot mới
          </Button>
        }
        style={{ marginTop: 40 }}
      >
        {dataSlotClinic.length !== 0 &&
          dataSlotClinic.map((item, index) => (
            <Card.Grid
              onClick={() => {
                setTimeSlot(item);
                setModalOpen("updateSlotClinic");
              }}
              style={gridStyle}
            >
              {item.time}
            </Card.Grid>
          ))}
      </Card>
      <Modal
        title="Vui lòng nhập"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(null)}
        onCancel={() => setModalOpen(null)}
        footer={[
          <Button key="back" onClick={() => setModalOpen(null)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              if (modalOpen === "changeNumberBoarding") {
                updateBoardingConfig();
              } else if (modalOpen === "updateSlotClinic") {
                updateSlotClinic();
              } else if (modalOpen === "addSlotClinic") {
                addSlotClinic();
              }
            }}
          >
            Xác nhận
          </Button>,
        ]}
      >
        {modalOpen === "changeNumberBoarding" && (
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 15, padding: 20 }}
            placeholder="Số ngày tối thiểu"
            prefix={<IoBedOutline color="grey" size={30} />}
            onChange={(e) => setDate(e.target.value)}
          />
        )}
        {modalOpen === "addSlotClinic" && (
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 15, padding: 20 }}
            placeholder="hh:mm"
            prefix={<IoTimeOutline color="grey" size={30} />}
            onChange={(e) => setNewTime(e.target.value)}
          />
        )}
        {modalOpen === "updateSlotClinic" && (
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 15, padding: 20 }}
            placeholder="Nhập giờ mới hh:mm"
            prefix={<IoTimerOutline color="grey" size={30} />}
            value={timeSlot.time}
            name="time"
            onChange={(e) =>
              setTimeSlot((timeSlot) => ({
                ...timeSlot,
                [e.target.name]: e.target.value,
              }))
            }
          />
        )}
      </Modal>
    </main>
  );
};

export default Config;
