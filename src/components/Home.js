import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
} from "react-icons/bs";
import { TrophyOutlined } from "@ant-design/icons";
import createAxios from "../services/axios";
import { Button, DatePicker, Form, Select, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./Home.module.scss";
import BarChart from "./chart/BarChart";
import LineChart from "./chart/LineChart";
const API = createAxios();

function Home() {
  const [totalBooking, setTotalBooking] = useState();
  const [bookingList, setBookingList] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [datePicked, setDatePicked] = useState();
  const [rankServiceList, setRankServiceList] = useState();
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingData, setBookingData] = useState();

  // Hàm trả về mảng 6 ngày trước và ngày hôm nay theo định dạng yyyy-mm-dd
  const getSixDaysAgoAndToday = () => {
    const dates = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Thêm '0' phía trước nếu cần
      const day = date.getDate().toString().padStart(2, "0"); // Thêm '0' phía trước nếu cần

      const formattedDate = `${year}-${month}-${day}`;
      dates.push(formattedDate);
    }

    return dates;
  };

  useEffect(() => {
    const sixDaysAgoAndToday = getSixDaysAgoAndToday();
    const dataBooking = new Array(sixDaysAgoAndToday.length); // Mảng để lưu các dữ liệu từ API

    // Sử dụng Promise.all cùng với map để duyệt qua mảng và gọi API
    Promise.all(
      sixDaysAgoAndToday.map((item, index) =>
        API.get(`/booking/?arrival_date=${item}`)
          .then((response) => {
            const parts = item.split("-"); // Tách ngày, tháng và năm
            const formattedDate = `${parts[2]}/${parts[1]}`; // Định dạng lại theo dd/mm
            dataBooking[index] = {
              data: response.data,
              date: formattedDate, // Ngày đã định dạng lại
              totalBooking: response.data.length,
              totalMoney: response.data.reduce((accumulator, item) => {
                const price = parseFloat(item.money_has_paid);
                return accumulator + price;
              }, 0),
            }; // Lưu response vào vị trí tương ứng trong mảng dataBooking
          })
          .catch((error) => {
            console.error(error); // Xử lý lỗi nếu có
          })
      )
    ).then(() => {
      console.log("dataBooking ne Long", dataBooking);
      setBookingData(dataBooking);
      // Xử lý dữ liệu sau khi đã có tất cả các phản hồi từ API
    });
  }, []);

  const columnsBooking = [
    {
      title: "STT",
      dataIndex: "index",
      sorter: (a, b) => a.index - b.index,
      width: "5%",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer_name",
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
      title: "Số điện thoại",
      dataIndex: "bird",
      render: (bird) => {
        return bird ? bird.customer.phone : "";
      },
      sorter: (a, b) => a.age - b.age,
      width: "10%",
    },
    {
      title: "Tên dịch vụ",
      dataIndex: "service_type",
      sorter: (a, b) => a.age - b.age,
      width: "15%",
    },
    {
      title: "Chim",
      dataIndex: "bird",
      render: (bird) => {
        return bird ? bird.name : "";
      },
      sorter: (a, b) => a.age - b.age,
      width: "10%",
    },
    {
      title: "Giờ đặt",
      dataIndex: "estimate_time",
      sorter: (a, b) => a.age - b.age,
      width: "5%",
    },
    {
      title: "Giờ checkin",
      dataIndex: "checkin_time",
      sorter: (a, b) => a.age - b.age,
      width: "5%",
    },

    // {
    //   title: "Giá tiền",
    //   dataIndex: "price",
    //   filters: [
    //     {
    //       text: "London",
    //       value: "London",
    //     },
    //     {
    //       text: "New York",
    //       value: "New York",
    //     },
    //   ],
    //   onFilter: (value, record) => record.address.startsWith(value),
    //   filterSearch: true,
    //   width: "10%",
    // },
    // {
    //   title: "Mô tả",
    //   dataIndex: "description",
    //   width: "20%",
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      // render: (accountData) => {
      //   return accountData ? accountData.status : "";
      // },
      width: "10%",
      sorter: (a, b) => {
        if (a.account && b.account) {
          return a.account.status.localeCompare(b.account.status);
        }
        return 0;
      },
    },
    // {
    //   title: "Hành động",
    //   dataIndex: "action",
    //   width: "10%",
    // },
  ];

  const onChangeDate = (date, dateString) => {
    console.log("Date String: ", dateString);
    setDatePicked(dateString);
  };

  const fetchBooking = async () => {
    try {
      let responseBooking;
      if (datePicked) {
        responseBooking = await API.get(`/booking/?arrival_date=${datePicked}`);
      } else {
        responseBooking = await API.get(`/booking`);
      }
      if (responseBooking.data) {
        console.log("Data booking", responseBooking.data);
        const dataAfterMap = responseBooking.data.map((item, index) => ({
          key: index,
          ...item,
          index: index + 1,
          action: (
            <Button type="default" icon={<EditFilled />} onClick={() => {}}>
              Chỉnh sửa
            </Button>
          ),
        }));
        setTotalBooking(responseBooking.data.length);
        setBookingList(dataAfterMap);
        setTotalPrice(
          responseBooking.data.reduce((accumulator, item) => {
            const price = parseFloat(item.money_has_paid);
            return accumulator + price;
          }, 0)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceFormDetail = async () => {
    try {
      const response = await API.get(`/service-form-detail`);
      if (response.data) {
        console.log("Data SFD", response.data);
        setServiceFormDetailList(response.data);
        /// Tạo một object để đếm số lần xuất hiện của từng service_package_id
        const countServices = response.data.reduce((count, item) => {
          const { service_package_id, note } = item;
          count[service_package_id] = count[service_package_id] || {
            count: 0,
            note: note,
          };
          count[service_package_id].count++;
          return count;
        }, {});

        // Chuyển object thành một mảng các đối tượng có dạng { service_package_id, count, note }
        const serviceCountsArray = Object.keys(countServices).map(
          (service_package_id) => ({
            service_package_id,
            count: countServices[service_package_id].count,
            note: countServices[service_package_id].note,
          })
        );

        // Sắp xếp mảng theo số lần xuất hiện từ cao đến thấp
        setRankServiceList(
          serviceCountsArray.sort((a, b) => b.count - a.count)
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookingFilter = (value) => {
    switch (value) {
      case "0":
        setTotalPrice(
          bookingList.reduce((accumulator, item) => {
            const price = parseFloat(item.money_has_paid);
            return accumulator + price;
          }, 0)
        );
        break;
      case "1":
        const newArr1 = bookingList.filter(
          (item) => item.service_type_id === "ST001"
        );
        setTotalPrice(
          newArr1.reduce((accumulator, item) => {
            const price = parseFloat(item.money_has_paid);
            return accumulator + price;
          }, 0)
        );
        break;
      case "2":
        const newArr2 = bookingList.filter(
          (item) => item.service_type_id === "ST002"
        );
        setTotalPrice(
          newArr2.reduce((accumulator, item) => {
            const price = parseFloat(item.money_has_paid);
            return accumulator + price;
          }, 0)
        );
        break;
      case "3":
        const newArr3 = bookingList.filter(
          (item) => item.service_type_id === "ST003"
        );
        setTotalPrice(
          newArr3.reduce((accumulator, item) => {
            const price = parseFloat(item.money_has_paid);
            return accumulator + price;
          }, 0)
        );
        break;
      default:
        // Handle default case if needed
        break;
    }
  };

  useEffect(() => {
    fetchBooking();
    fetchServiceFormDetail();
    // fetchBill();
  }, []);

  useEffect(() => {}, []);

  // Định dạng tổng tiền theo tiền tệ Việt Nam
  const formattedPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  useEffect(() => {
    fetchBooking();
  }, [datePicked]);

  return (
    <main className="main-container">
      <div className="main-title">
        <h1 style={{ color: "black" }}>DASHBOARD</h1>
      </div>
      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>SỐ LỊCH HẸN</h3>
            <BsFillArchiveFill className="card_icon" />
          </div>
          <h1>{totalBooking}</h1>
        </div>
        <div className="card">
          <Form.Item label="Doanh thu">
            <Select
              defaultValue="0"
              onChange={(value) => handleBookingFilter(value)}
            >
              <Select.Option value="0" selected>
                Tổng
              </Select.Option>
              <Select.Option value="1">Khám tổng quát</Select.Option>
              <Select.Option value="2">SPA, làm đẹp</Select.Option>
              <Select.Option value="3">Nội trú</Select.Option>
            </Select>
          </Form.Item>
          <div className="card-inner"></div>
          <h1>{formattedPrice(totalPrice)}</h1>
        </div>
        {/* <div className="card">
          <div className="card-inner">
            <h3>CUSTOMERS</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          <h1>33</h1>
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ALERTS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>42</h1>
        </div> */}
      </div>

      <div className="charts">
        <div style={{ width: 800 }}>
          {bookingData && (
            <BarChart
              chartData={{
                labels: bookingData.map((data) => data.date),
                datasets: [
                  {
                    label: "Tổng số cuộc hẹn trong ngày",
                    data: bookingData.map((data) => data.totalBooking),
                    backgroundColor: [
                      "rgba(75,192,192,1)",
                      // "#ecf0f1",
                      // "#50AF95",
                      // "#f3ba2f",
                      // "#2a71d0",
                    ],
                    // borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              }}
            />
          )}
          {bookingData && (
            <LineChart
              chartData={{
                labels: bookingData.map((data) => data.date),
                datasets: [
                  {
                    label: "Tổng doanh thu theo ngày",
                    data: bookingData.map((data) => data.totalMoney),
                    backgroundColor: [
                      // "rgba(75,192,192,1)",
                      // "#ecf0f1",
                      // "#50AF95",
                      // "#f3ba2f",
                      "#2a71d0",
                    ],
                    // borderColor: "black",
                    borderWidth: 2,
                  },
                ],
              }}
            />
          )}
        </div>
        <div className={styles.rankingService}>
          <h3>
            <TrophyOutlined /> Top các dịch vụ được sử dụng
          </h3>
          <table>
            <thead>
              <tr>
                <th>Tên dịch vụ</th>
                <th>Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {rankServiceList &&
                rankServiceList.length > 0 &&
                rankServiceList.map((service, index) => (
                  <tr key={index}>
                    <td>{service.note}</td>
                    <td>{service.count}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bookingList" style={{ marginTop: 100 }}>
        <h1 style={{ color: "black" }}>THEO DÕI LỊCH KHÁM</h1>
        <DatePicker
          size="large"
          onChange={onChangeDate}
          placeholder="Chọn ngày"
          style={{ marginBottom: 20 }}
        />
        <Table
          columns={columnsBooking}
          dataSource={bookingList}
          // onChange={onChange}
        />
      </div>
    </main>
  );
}

export default Home;
