import React, { useState, useEffect, Fragment } from "react";
import { Page,List, Icon, Modal ,Box } from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
import { useLocation } from "react-router-dom";
import * as dateFns from "date-fns";
const { format } = dateFns;
import axios from "axios";

//style  để định dạng cặp thông tin
const pairStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "-15px",
};

const { Item } = List;

const  DayScorses = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDayScorses, setSelectedDayScorses] = useState(null);
    const location = useLocation();
  
    const { studentName, studentGuid } = location.state || {};
    console.log("StudenGuiId cua Diem Danh:", studentGuid);
    const [dayScorsess, setDayScorsess] = useState([]);
    useEffect(() => {
      configAppView({
        headerColor: "#8861bb",
        "statusBarColor": "#8861bb",
        headerTextColor: "white",
        hideAndroidBottomNavigationBar: true,
        hideIOSSafeAreaBottom: true,
        actionBar: {
          title: "Danh sách điểm danh",
          leftButton: "back",
        },
        success: (res) => {
          console.log('Goi thanh cong');
        },
        fail: (error) => {
          console.log(error);
        },
      });
    }, []);

    useEffect(() => {
      const fetchDayScorses = async () => {
        try {
          const response = await axios.get(
            `https://ileader.cloud/api/MiniApp/GetListNotifys?msgType=ĐD-NX&guidStudent=${studentGuid}`
          );
  
          // Cập nhật trạng thái với danh sách hóa đơn từ API
          setDayScorsess(response.data.data.reverse());
        } catch (error) {
          console.error("Lỗi khi lấy danh sách bảng điểm:", error);
        }
      };
      // Gọi hàm để lấy danh sách hóa đơn
      fetchDayScorses();
    }, [studentGuid]);
  
    
  const formatDayScorses = (dayScorsess) => {
    if (!dayScorsess || !dayScorsess.jsonContent) return null; 
    const parsedJsonContent = JSON.parse(dayScorsess.jsonContent);
    console.log("Account object:", dayScorsess);

    // Hàm định dạng ngày thành "dd/MM/yyyy"
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const parsedDate = new Date(dateString);
      return format(parsedDate, "dd/MM/yyyy");
    };
    const infoPairs = [
      {
        label: "Trạng thái",
        value: parsedJsonContent.Status ?? parsedJsonContent.Status,
      },
      {
        label: "Nhận xét",
        value: parsedJsonContent.CriteriaName ?? parsedJsonContent.CriteriaName,
      },
    ];

    return (
      <Fragment>
        {infoPairs.map((pair, index) => (
          <div
            style={{
              ...pairStyle,
              marginBottom: index === infoPairs.length - 1 ? 0 : "-15px",
            }}
            key={index}
          >
            <span>{pair.label}:</span>
          {Array.isArray(pair.value) ? ( // Kiểm tra nếu value là một mảng
            <span>
              {pair.value.map((item, i) => (
                <Fragment key={i}>
                  {item}
                  {i !== pair.value.length - 1 && <span>,</span>}
                </Fragment>
              ))}
            </span>
          ) : (
            <span>{pair.value}</span>
          )}
        </div>
        ))}
      </Fragment>
    );
  };
  return (
    <Page className="section-container">
      <List>
      {dayScorsess.map((dayScorses) => (
          <Item
            key={dayScorses.guid}
            title={dayScorses.title}
            prefix={<Icon icon="zi-calendar" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => {
              setModalVisible(true);
              setSelectedDayScorses(dayScorses);
            }}
          />
        ))}
      </List>
      <Modal
        visible={modalVisible}
        title="Bảng điểm danh"
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
          {selectedDayScorses && (
            <React.Fragment>
              {[]
                .concat(formatDayScorses(selectedDayScorses))
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
}
export default DayScorses;

