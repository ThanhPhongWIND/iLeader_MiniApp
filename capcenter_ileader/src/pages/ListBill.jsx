import React, { useState, useEffect } from "react";
import {useLocation } from "react-router-dom";

import { Page, Text, Box, Modal, useNavigate, Icon, List } from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
import axios from "axios";
import "../css/listbill.css";
const { Item } = List;

const ListBill = ({ tasks, props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { studentGuid } = location.state || {};
  console.log("StudenGuiId:", studentGuid);

  const [modalVisible, setModalVisible] = useState(false);
  const [bills, setBills] = useState([]);
  useEffect(() => {
    // Gọi API configAppView để cấu hình giao diện ứng dụng
    configAppView({
      headerColor: "#8861bb",
      statusBarColor: "#8861bb",
      headerTextColor: "white",
      hideAndroidBottomNavigationBar: true,
      hideIOSSafeAreaBottom: true,
      actionBar: {
        title: "Danh sách thông báo",
        leftButton: "back",
      },
      success: (res) => {
        // Xử lý khi gọi API thành công
        console.log("Goi thanh cong");
      },
      fail: (error) => {
        // Xử lý khi gọi API thất bại
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get(
          `https://ileader.cloud/api/MiniApp/GetListNotifys?msgType=SK&guidStudent=${studentGuid}`
        );

        // Cập nhật trạng thái với danh sách hóa đơn từ API
        setBills(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      }
    };
    // Gọi hàm để lấy danh sách hóa đơn
    fetchBills();
  }, [studentGuid]);
  return (
    <Page className="section-container">
      <List>
        {bills.map((bill) => (
          <Item
            key={bill.guidSender} // Đảm bảo sử dụng một giá trị duy nhất làm key
            title={bill.title}
            prefix={<Icon icon="zi-calendar" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => {
              setModalVisible(true);
            }}
          />
        ))}
      </List>
      <Modal
        visible={modalVisible}
        title="Thông báo"
        onClose={() => {
          setModalVisible(false);
        }}
        zIndex={1200}
        actions={[
          {
            text: "Đã hiểu",
            close: true,
          },
          {
            text: "Thoát",
            close: true,
            highLight: true,
          },
        ]}
        
        description={`Thông báo: ${bills[0]?.jsonContent.replace(/\\n/g, '\n').replace(/^"(.*)"$/, '$1') || ""}`}
        />
    </Page>
  );
};

export default ListBill;
