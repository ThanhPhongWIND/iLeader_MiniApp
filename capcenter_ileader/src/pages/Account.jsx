import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Page, Text, Box, Modal, useNavigate, Icon, List } from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
const { Item } = List;
import * as dateFns from "date-fns";
const { format } = dateFns;
import "../css/listbill.css";
import "../css/detailHome.css";


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
  const [isChecked, setIsChecked] = useState({});

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
          `https://cap2.ileader.vn/api/MiniApp/GetListNotifys?msgType=HP&guidStudent=${studentGuid}`
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

    const formatCurrency = (value) => {
      if (value === undefined || value === null) return "";
      // Ép kiểu tiền tệ Việt Nam đồng
      return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
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
        value: formatCurrency(parsedJsonContent.Abate ?? parsedJsonContent.Abate),
      },
      {
        label: "Ví tiền",
        value: formatCurrency(parsedJsonContent.Purse ?? parsedJsonContent.Purse),
      },
      {
        label: "Tổng thu",
        value: formatCurrency(parsedJsonContent.TotalBill ?? parsedJsonContent.TotalBill),
      },
      {
        label: "Hình thức thanh toán",
        value: parsedJsonContent.FormsOfPayment ?? parsedJsonContent.FormsOfPayment,
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

  //Notice
  useEffect(() => {
    const loadCheckedState = () => {
      const storedCheckedState = localStorage.getItem("isChecked");
      if (storedCheckedState) {
        setIsChecked(JSON.parse(storedCheckedState));
      }
    };

    loadCheckedState();
  }, []);

  const saveCheckedState = (newState, callback) => {
    localStorage.setItem("isChecked", JSON.stringify(newState));
    setIsChecked(newState);
    if (callback) {
      callback();
    }
  };
  const handleItemClick = (account) => {
    const newIsChecked = { ...isChecked };
    const currentState = isChecked[account.guid];
    if (currentState === undefined) {
      newIsChecked[account.guid] = true;
    } else {
      newIsChecked[account.guid] = currentState;
    }
    saveCheckedState(newIsChecked, () => {
      setModalVisible(true);
      setSelectedAccount(account);
    });
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
            onClick={() => handleItemClick(account)}
            className={isChecked[account.guid] ? "checked" : ""}
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
