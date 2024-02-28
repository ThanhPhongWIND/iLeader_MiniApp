import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Page,
  Text,
  Box,
  Modal,
  useNavigate,
  Icon,
  List,
  Input,
  Checkbox,
} from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
import * as dateFns from "date-fns";
const { format } = dateFns;

import "../css/listbill.css";

const { Item } = List;

//style  để định dạng cặp thông tin
const pairStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "-15px",
};

const Notification = ({ tasks, props }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReg, setSelectedReg] = useState(null);

  const { studentGuid } = location.state || {};
  console.log("StudenGuiId:", studentGuid);

  const [regs, setRegs] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    // Gọi API configAppView để cấu hình giao diện ứng dụng
    configAppView({
      headerColor: "#8861bb",
      statusBarColor: "#8861bb",
      headerTextColor: "white",
      hideAndroidBottomNavigationBar: true,
      hideIOSSafeAreaBottom: true,
      actionBar: {
        title: "Đăng ký",
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
    const fetchReg = async () => {
      try {
        const response = await axios.get(
          `https://ileader.cloud/api/MiniApp/GetListNotifys?msgType=ĐK&guidStudent=${studentGuid}`
        );

        // Cập nhật trạng thái với danh sách hóa đơn từ API
        setRegs(response.data.data.reverse());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kế toán:", error);
      }
    };
    // Gọi hàm để lấy danh sách hóa đơn
    fetchReg();
  }, [studentGuid]);

  const formatRegInfo = (regs) => {
    const parsedJsonContent = JSON.parse(regs.jsonContent || "{}");
    console.log("Account object:", regs);

    // Hàm định dạng ngày thành "dd/MM/yyyy"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const parsedDate = new Date(dateString);
      return format(parsedDate, "dd/MM/yyyy");
    };
    const infoPairs = [
      {
        label: "Mã phiếu",
        value: parsedJsonContent.Id ?? parsedJsonContent.Id,
      },
      {
        label: "Ngày đăng ký",
        value: formatDate(parsedJsonContent.RegisterDate),
      },
      {
        label: "Mã học viên",
        value: parsedJsonContent.StudentId ?? parsedJsonContent.StudentId,
      },
      {
        label: "Họ tên",
        value: parsedJsonContent.StudentName ?? parsedJsonContent.StudentName,
      },
      {
        label: "Người tạo",
        value: parsedJsonContent.EmployeeName ?? parsedJsonContent.EmployeeName,
      },
      {
        label: "Tổng hóa đơn",
        value: parsedJsonContent.Paid ?? parsedJsonContent.Paid,
      },

      {
        label: "Thanh toán",
        value: parsedJsonContent.TotalBill ?? parsedJsonContent.TotalBill,
      },
      {
        label: "Còn nợ",
        value: parsedJsonContent.TotalBill ?? parsedJsonContent.TotalBill,
      },
      {
        label: "Ghi chú",
        value: parsedJsonContent.Note || "N/A",
      },
    ];
    return infoPairs.map((pair, index) => (
      <div
        style={{
          ...pairStyle,
          marginBottom: index === infoPairs.length - 1 ? 0 : "-15px",
        }}
        key={index}
      >
        <span>{pair.label}:</span>
        <span>{pair.value}</span>
      </div>
    ));
  };

  return (
    <Page className="section-container">
      <List>
        {regs.map((reg) => (
          <Item
            key={reg.guid}
            title={reg.title}
            prefix={<Icon icon="zi-calendar" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => {
              setModalVisible(true);
              setSelectedReg(reg);
            }}
          />
        ))}
      </List>
      <Modal
        visible={modalVisible}
        title=" Thông báo"
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
        description=""
      >
        <Box className="space-y-4">
          {selectedReg && (
            <React.Fragment>
              {formatRegInfo(selectedReg)
                .flat()
                .map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
            </React.Fragment>
          )}
        </Box>
      </Modal>
    </Page>
  );
};

export default Notification;
