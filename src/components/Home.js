import React, { useEffect, useState } from "react";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import { TrophyOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import createAxios from "../services/axios";
import { Button, DatePicker, Form, Select, Table } from "antd";
import { EditFilled } from "@ant-design/icons";
import { EditOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import styles from "./Home.module.scss";
const API = createAxios();

function Home() {
  const [totalBooking, setTotalBooking] = useState();
  const [bookingList, setBookingList] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [datePicked, setDatePicked] = useState();
  const [rankServiceList, setRankServiceList] = useState();

  const [totalPrice, setTotalPrice] = useState(0);

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

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

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
        <div className="card">
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
        </div>
      </div>

      <div className="charts">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="pv" fill="#8884d8" />
            <Bar dataKey="uv" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
        {/* <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer> */}
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
      <div className="bookingList">
        <h1 style={{ color: "black" }}>DANH SÁCH LỊCH KHÁM</h1>
        <DatePicker
          size="large"
          onChange={onChangeDate}
          placeholder="Chọn ngày"
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
