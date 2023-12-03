import React, { useState, useEffect } from "react";
import styles from "./Config.module.scss";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { IoBedOutline } from "react-icons/io5";
import { Card, Button, Modal, Input, message } from "antd";
import createAxios from "../services/axios";
const API = createAxios();

const { Meta } = Card;
const Config = () => {
  const [dateBoardingConfig, setDateBoardingConfig] = useState();
  const [modalOpen, setModalOpen] = useState(false);
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
      const response = await API.put(`/config/?key=at_least_day_boarding&value=${date}`);
      if (response.data) {
        console.log("Data Config post trả về", response.data);
        setDateBoardingConfig(response.data);
        message.success(`Cập nhật thành công.`);
        setModalOpen(false);
        fetchDataBoardingConfig();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataBoardingConfig();
  }, []);

  return (
    <div className={styles.container}>
      <h1 style={{ color: "black" }}>Cấu hình</h1>
      <Card
        style={{
          width: 400,
        }}
        actions={[
          <SettingOutlined key="setting" />,
          <EditOutlined key="edit" onClick={() => setModalOpen(true)} />,
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
            {dateBoardingConfig ? dateBoardingConfig.at_least_day_boarding : "   "}{" "}
            ngày
          </Button>
        </div>
      </Card>
      <Modal
        title="Vui lòng nhập"
        centered
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setModalOpen(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => updateBoardingConfig()}
          >
            Xác nhận
          </Button>,
        ]}
      >
        <Input
          size="large"
          style={{ marginBottom: 15, marginTop: 15, padding: 20 }}
          placeholder="Số ngày tối thiểu"
          prefix={<IoBedOutline size={30} />}
          onChange={(e)=> setDate(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Config;
