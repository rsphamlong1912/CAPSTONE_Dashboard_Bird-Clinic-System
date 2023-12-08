import React, { useState, useEffect } from "react";
import styles from "./Config.module.scss";
import { IoBedOutline, IoTimeOutline, IoTimerOutline, IoCreateOutline, IoLayersOutline   } from "react-icons/io5";
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
  const [servicePackage, setServicePackage] = useState();

  const [timeSlot, setTimeSlot] = useState({
    slot_clinic_id: "",
    time: "",
  });
  const [newTime, setNewTime] = useState();
  const [newPrice, setNewPrice] = useState();

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

  const fetchServicePackage = async () => {
    try {
      const response = await API.get(
        `/service-package/?service_type_id=ST001`
      );
      if (response.data) {
        console.log("Data service package", response.data);
        const filterArray = response.data.find(
          (item) =>
            item.service_package_id === "SP1"
        );
        setServicePackage(filterArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateSlotClinic = async () => {
    try {
      const response = await API.put(
        `/slot-clinic/${timeSlot.slot_clinic_id}`,
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
      const response = await API.post(`/slot-clinic/`, { time: newTime });
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

  const updatePriceServicePackage = async () => {
    try {
      const response = await API.put(
        `/service-package/${servicePackage.service_package_id}`,
        {
          price: newPrice,
        }
      );
      if (response.data) {
        console.log("Change thanh cong");
        message.success(`Cập nhật giá tiền thành công.`);
        setModalOpen(null);
        fetchServicePackage();
      }
    } catch (error) {
      console.log(error);
      message.error(`Cập nhật giá tiền thất bại.`);
    }
  };

  useEffect(() => {
    fetchDataBoardingConfig();
    fetchDataSlotClinic();
    fetchServicePackage();
  }, []);

  useEffect(() => {
    console.log("Time slot: ", timeSlot);
  }, [timeSlot]);

  useEffect(() => {
    console.log("Service Package: ", servicePackage);
  }, [servicePackage]);

  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <main className="main-container">
      <h1 style={{ color: "black" }}>CẤU HÌNH</h1>
      <div style={{display: "flex", flexDirection: 'row'}}>
      <Card
        style={{
          width: 400,
          marginRight: 20
        }}
        actions={[
          <IoCreateOutline  size={30}
            key="edit"
            onClick={() => setModalOpen("changeNumberBoarding")}
          />,
        ]}
      >
        <div>
          <Meta
            avatar={<IoBedOutline color="grey"  size={60} />}
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
        style={{
          width: 500,
        }}
        actions={[
          <IoCreateOutline   size={30}
            key="edit"
            onClick={() => setModalOpen("changePriceHealthCheck")}
          />,
        ]}
      >
        <div>
          <Meta
            avatar={<IoLayersOutline color="grey"  size={60} />}
            title="Khám tổng quát"
            description="Giá tiền"
          />
          <Button
            style={{ position: "absolute", right: 20, top: 20 }}
            size="large"
            type="primary"
            shape="round"
          >
            {servicePackage
              ? formattedPrice(servicePackage.price)
              : "   "}{" "}
          </Button>
        </div>
      </Card>
      </div>
      <Card
        title="Slot phòng khám"
        extra={
          <Button type="primary" onClick={() => setModalOpen("addSlotClinic")}>
            Tạo slot mới
          </Button>
        }
        style={{ marginTop: 20 }}
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
        title="Vui lòng nhập:"
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
              } else if (modalOpen === "changePriceHealthCheck"){
                updatePriceServicePackage();
              }
            }}
          >
            Xác nhận
          </Button>,
        ]}
      >
        {modalOpen === "changeNumberBoarding" && (
          <div style={{margin: "20px 0px", position: 'relative'}}>
          <span style={{fontWeight: 700, position: 'absolute', zIndex: 999, top: -5, left: 15,backgroundColor:'white', padding: 5, color: '#32b768'}}>Số ngày tối thiểu</span>
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 15, padding: 20 }}
            placeholder="Số ngày tối thiểu"
            prefix={<IoBedOutline color="grey" size={30} />}
            onChange={(e) => setDate(e.target.value)}
          />
          </div>
        )}
        {modalOpen === "addSlotClinic" && (
          <div style={{margin: "20px 0px"}}>
          <span style={{fontWeight: 700}}>Giờ mới hh:mm</span>
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 5, padding: 20 }}
            placeholder="hh:mm"
            prefix={<IoTimeOutline color="grey" size={30} />}
            onChange={(e) => setNewTime(e.target.value)}
          />
          </div>
        )}
        {modalOpen === "updateSlotClinic" && (
          <div style={{margin: "20px 0px"}}>
          <span style={{fontWeight: 700}}>Giờ thay đổi hh:mm</span>
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 5, padding: 20 }}
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
          </div>
        )}
        {modalOpen === "changePriceHealthCheck" && (
          <div style={{margin: "20px 0px"}}>
          <span style={{fontWeight: 700}}>Giá tiền dịch vụ</span>
          <Input
            size="large"
            style={{ marginBottom: 15, marginTop: 5, padding: 20 }}
            placeholder="Thay đổi giá tiền dịch vụ"
            prefix={<IoLayersOutline color="grey" size={30} />}
            value={newPrice ? newPrice : servicePackage.price}
            name="price"
            onChange={(e) =>
              setNewPrice(e.target.value)
            }
          />
          </div>
        )}
      </Modal>
    </main>
  );
};

export default Config;
