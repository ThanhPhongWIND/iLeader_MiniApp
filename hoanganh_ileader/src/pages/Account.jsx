import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Page, Text, Box, Modal, useNavigate, Icon, List } from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
const { Item } = List;
import * as dateFns from "date-fns";
const { format } = dateFns;
import "../css/listbill.css";

const pairStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "-15px",
};

const Notification = ({ tasks, props }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { studentGuid } = location.state || {};
  console.log("StudenGuiId:", studentGuid);

  const [accounts, setAccounts] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    // Gọi API configAppView để cấu hình giao diện ứng dụng
    configAppView({
      headerColor: "#8861bb",
      statusBarColor: "#8861bb",
      headerTextColor: "white",
      hideAndroidBottomNavigationBar: true,
      hideIOSSafeAreaBottom: true,
      actionBar: {
        title: "Học phí",
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
    const fetchAccount = async () => {
      try {
        const response = await axios.get(
          `https://ileader.cloud/api/MiniApp/GetListNotifys?msgType=HP&guidStudent=${studentGuid}`
        );

        // Cập nhật trạng thái với danh sách hóa đơn từ API
        setAccounts(response.data.data.reverse());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách kế toán:", error);
      }
    };
    // Gọi hàm để lấy danh sách hóa đơn
    fetchAccount();
  }, [studentGuid]);

  const formatAccountInfo = (accounts) => {
    const parsedJsonContent = JSON.parse(accounts.jsonContent || "{}");
    console.log("Account object:", accounts);

    // Hàm định dạng ngày thành "dd/MM/yyyy"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const parsedDate = new Date(dateString);
      return format(parsedDate, "dd/MM/yyyy");
    };

    const infoPairs = [
      {
        label: "Mã phiếu đăng ký",
        value: parsedJsonContent.RegisterId ?? parsedJsonContent.RegisterId,
      },
      {
        label: "Mã phiếu thu",
        value: parsedJsonContent.Id ?? parsedJsonContent.Id,
      },
      {
        label: "Ngày thu",
        value: formatDate(parsedJsonContent.DateCreated),
      },
      {
        label: "Thanh toán",
        value: parsedJsonContent.Abate ?? parsedJsonContent.Abate,
      },
      {
        label: "Ví tiền",
        value: parsedJsonContent.Purse ?? parsedJsonContent.Purse,
      },
      {
        label: "Tổng thu",
        value: parsedJsonContent.TotalBill ?? parsedJsonContent.TotalBill,
      },
      {
        label: "Hình thức thanh toán",
        value:
          parsedJsonContent.FormsOfPayment ?? parsedJsonContent.FormsOfPayment,
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
        {accounts.map((account) => (
          <Item
            key={account.guid}
            title={account.title}
            prefix={<Icon icon="zi-calendar" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => {
              setModalVisible(true);
              setSelectedAccount(account);
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
          {selectedAccount && (
            <React.Fragment>
              {formatAccountInfo(selectedAccount)
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
