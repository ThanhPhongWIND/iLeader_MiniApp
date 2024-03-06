import React, { useState, useEffect, Fragment } from "react";
import { Page, List, Icon, Modal, Box } from "zmp-ui";
import { useLocation } from "react-router-dom";
import { configAppView } from "zmp-sdk/apis";
import axios from "axios";
import * as dateFns from "date-fns";
import "../css/transcript.css";
import "../css/detailHome.css";

const { format } = dateFns;
const { Item } = List;
//style  để định dạng cặp thông tin
const pairStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "-15px",
};
const TranScript = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTranScrpit, setSelectedTranScrpit] = useState(null);
  const location = useLocation();

  const { studentName, studentGuid } = location.state || {};
  console.log("Ten hoc sinh phan abng diem:", studentName);
  console.log("StudenGuiId:", studentGuid);
  const [tranScripts, settranScripts] = useState([]);
  const [isChecked, setIsChecked] = useState({});

  useEffect(() => {
    configAppView({
      headerColor: "#8861bb",
      statusBarColor: "#8861bb",
      headerTextColor: "white",
      hideAndroidBottomNavigationBar: true,
      hideIOSSafeAreaBottom: true,
      actionBar: {
        title: "Bảng điểm của học sinh",
        leftButton: "back",
      },
      success: (res) => {
        console.log("Goi thanh cong");
      },
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    const fetchTranScript = async () => {
      try {
        const response = await axios.get(
          `https://cap2.ileader.vn/api/MiniApp/GetListNotifys?msgType=BĐ&guidStudent=${studentGuid}`
        );

        // Cập nhật trạng thái với danh sách hóa đơn từ API
        settranScripts(response.data.data.reverse());
      } catch (error) {
        console.error("Lỗi khi lấy danh sách bảng điểm:", error);
      }
    };
    // Gọi hàm để lấy danh sách hóa đơn
    fetchTranScript();
  }, [studentGuid]);

  useEffect(() => {
    const loadCheckedState = () => {
      const storedCheckedState = localStorage.getItem("isChecked");
      if (storedCheckedState) {
        setIsChecked(JSON.parse(storedCheckedState));
      }
    };
  
    loadCheckedState();
  }, []);
  
  const formatTranScript = (tranScript) => {
    if (!tranScript || !tranScript.jsonContent) return null; // Kiểm tra tranScript có tồn tại và có thuộc tính jsonContent không
    const parsedJsonContent = JSON.parse(tranScript.jsonContent);
    console.log("Account object:", tranScript);

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const parsedDate = new Date(dateString);
      return format(parsedDate, "dd/MM/yyyy");
    };
    const detailItems = parsedJsonContent.Details.map((detail, index) => (
      <div key={index}>
        <span>{detail.ColumName}:</span>
        <span className="fr-studentName">{detail.ColumnContent}</span>
      </div>
    ));

    return (
      <Fragment>
        {studentName && (
          <div>
            <span>Tên học sinh:</span>
            <span className="fr-studentName">{studentName}</span>
          </div>
        )}
        {detailItems}
      </Fragment>
    );
  };

 
  const saveCheckedState = (newState, callback) => {
    localStorage.setItem("isChecked", JSON.stringify(newState));
    setIsChecked(newState);
    if (callback) {
      callback();
    }
  };
  const handleItemClick = (tranScript) => {
    const newIsChecked = { ...isChecked };
    const currentState = isChecked[tranScript.guid];
    if (currentState === undefined) {
      newIsChecked[tranScript.guid] = true;
    } else {
      newIsChecked[tranScript.guid] = currentState;
    }
    saveCheckedState(newIsChecked, () => {
      setModalVisible(true);
      setSelectedTranScrpit(tranScript);
    });
  };
  


  return (
    <Page className="section-container">
      <List>
        {tranScripts.map((tranScript) => (
          <Item
            key={tranScript.guid}
            title={tranScript.title}
            prefix={<Icon icon="zi-calendar" />}
            suffix={<Icon icon="zi-chevron-right" />}
            onClick={() => handleItemClick(tranScript)}
            className={isChecked[tranScript.guid] ? "checked" : ""}
            
          />
        ))}
      </List>
      <Modal
        visible={modalVisible}
        title="Bảng điểm học viên"
        onClose={() => {
          // Reset checked state when Modal is closed
          saveCheckedState(isChecked);
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
          {selectedTranScrpit && (
            <React.Fragment>
              {[]
                .concat(formatTranScript(selectedTranScrpit))
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

export default TranScript;
