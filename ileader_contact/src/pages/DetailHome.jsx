import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { setNavigationBarTitle, getUserInfo, interactOA, openChat } from "zmp-sdk/apis";
import {
  BottomNavigation,
  Box,
  Icon,
  Page,
  Sheet,
  Swiper,
  Text,
  useTheme,
} from "zmp-ui";
import { axiosClient } from "../configs/axios";
import "../css/detailHome.css";

const DetailHome = (props) => {
  const location = useLocation();
  const { studentName, studentGuid } = location.state || {};
  const { title, back } = props;
  const pageRef = useRef(null);
  const [theme] = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("chat");
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [actionSheetAcount, setActionSheetAcount] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  // Call API configAppView
  useEffect(() => {
    const fetchData = async () => {
      try {
        await setNavigationBarTitle({
          title: studentName,
          success: (res) => {
            console.log("Thiết lập tiêu đề thành công:", res);
          },
          fail: (error) => {
            console.error("Lỗi khi thiết lập tiêu đề:", error);
          },
        });
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
  
    fetchData();
  }, [studentName]);
  
  console.log("StudenGuiId:", studentGuid);

  const handleNotificationClick = () => {
    interactOA({
      oaId: "3999529157940989049",
      success: (res) => {
        console.log("Interact OA success:", res);
      },
      fail: (err) => {
        console.error("Interact OA error:", err);
      },
    });
    navigate("/Notification" , { state: { studentGuid } });
  };

  const handleListBillonClick = () => {

    console.log("Navigating to ListBill with studentGuid:", studentGuid);
    navigate("/Notice", { state: { studentGuid } });
  };
  

  const openChatScreen = async () => {
    try {
      await openChat({
        type: "oa",
        id: "3999529157940989049",
        message: "Xin Chào",
        success: async () => {
          try {
            const res = await axiosClient.post("https://miniapp.ileader.vn/api/Test", {
              message: "Xin chào từ Zalo",
            }, {
              timeout: 5000 , 
            });
            console.log(res);
          } catch (error) {
            console.error("Error sending message to server:", error);
          }
        },
        fail: (err) => {
          console.error("Failed to open chat:", err);
        },
      });
    } catch (error) {
      console.error("Error opening chat:", error);
    }
  };
  
  

  const handleRegisteronClick = () => {
    navigate("/register");
  };

  return (
    <Page className="container plc-action">
      <Text.Title size="small" className="text-title">
        TRUNG TÂM ĐÀO TẠO SLK
      </Text.Title>
      <Box
        mt={6}
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Swiper>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="/images/ileader_1.jpg"
              alt="slide-1"
            />
          </Swiper.Slide>
          <Swiper.Slide>
            <img
              className="slide-img"
              src="/images/ileader_2.png"
              alt="slide-2"
            />
          </Swiper.Slide>
         
        </Swiper>
      </Box>

      <Box mt={6} className="call-admin">
        <a className="link-admin" onClick={openChatScreen}>
          <p className="text-success">
            Bấm vào đây để kết nối với Trung Tâm SLK SUPPORT !
          </p>
          <Icon className="icon-admin" icon="zi-user-window-solid" />
        </a>
      </Box>
      <Box mt={6} className="call-register">
        <a className="form-register">
          <div className="icon-left">
            <a>
              <Icon className="icon-register" icon="zi-calendar-solid" />
            </a>
            <p className="text-icon ">Đăng ký học viên</p>
          </div>
          <div className="icon-right">
            <Icon className="icon-user" icon="zi-user-solid" />
            <p className="text-icon ">Học viên</p>
          </div>
        </a>
      </Box>
      <Box mt={6}>
        <Text.Title className="text-title">Hệ thống Trung Tâm SLK</Text.Title>
        <Text.Title className="text-detail">
          iLeader cung cấp cho trung tâm ngoại ngữ công cụ hỗ trợ vận hành trung
          tâm hiệu quả nhất, tất cả các đầu công việc được vận hành trên phần
          mềm, lưu trữ và tra cứu thông tin nhanh chóng, giúp nhân sự tiết kiệm
          thời gian và giảm sai sót trong công việc. Từ đó giúp trung tâm tập
          trung và việc nâng cao chất lượng dịch vụ để phát triển hệ thống trung
          tâm, mở rộng quy mô và phát triển
        </Text.Title>
      </Box>

      <BottomNavigation
        fixed
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        style={{ marginTop: "56px" }}
      >
        <BottomNavigation.Item
          key="chat"
          label="Tin Nhắn"
          icon={<Icon icon="zi-chat" />}
          activeIcon={<Icon icon="zi-chat-solid" />}
          onClick={openChatScreen}
        />
        <BottomNavigation.Item
          label="Thông báo"
          key="contact"
          icon={<Icon icon="zi-clock-1" />}
          activeIcon={<Icon icon="zi-clock-1-solid" />}
          onClick={() => {
            handleListBillonClick(studentGuid);
          }}
        />

        <BottomNavigation.Item
          key="timeline"
          label="Kế toán"
          icon={<Icon icon="zi-calendar" />}
          activeIcon={<Icon icon="zi-calendar-solid" />}
          onClick={() => {
            setActionSheetAcount(true);
          }}        
          />
        <BottomNavigation.Item
          key="me"
          label="Học vụ"
          icon={<Icon icon="zi-user" />}
          activeIcon={<Icon icon="zi-user-solid" />}
          onClick={() => {
            setActionSheetVisible(true);
          }}
        />
      </BottomNavigation>
      <Sheet.Actions
        mask
        visible={actionSheetVisible}
        title="Phụ huynh có thể vào đây xem thông tin học sinh"
        onClose={() => setActionSheetVisible(false)}
        swipeToClose
        actions={[
          [
            {
              text: "Thời khóa biểu",
              onClick: () => {
                navigate("/TimeTable",  { state: { studentGuid } });
              },
            },
            {
              text: "Bảng điểm",
              onClick: () => {
                navigate("/transcript", { state: { studentName,studentGuid } });
              },
            },
            {
              text: "Điểm danh",
              onClick: () => {
                navigate("/dayscorses", { state: { studentGuid } });
              },
            },
          ],
          [{ text: "Thoát", close: true }],
        ]}
      />

      {/* //Acount  */}
      <Sheet.Actions
        mask
        visible={actionSheetAcount}
        title="Vào đây xem thông tin thiếu đăng ký và học phí"
        onClose={() => setActionSheetAcount(false)}
        swipeToClose
        actions={[
          [
            
            {
              text: "Phiếu thu học phí",
              onClick: () => {
                navigate("/account" , { state: { studentGuid } });
              },
            },
            {
              text: "Phiếu thu đăng ký ",
              onClick: () => {
                navigate("/reg", { state: { studentGuid } });
              },
            },
          ],
          [{ text: "Thoát", close: true }],
        ]}
      />
    </Page>
  );
};

export default DetailHome;
