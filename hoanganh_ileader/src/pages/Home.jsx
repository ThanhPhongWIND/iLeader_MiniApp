import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  BottomNavigation,
  Icon,
  Page,
  Box,
  Button,
  Text,
  Header,
  useTheme,
  Sheet,
  List,
  Avatar,
} from "zmp-ui";
import { configAppView } from "zmp-sdk/apis";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/homepage.css";
import "../css/listWork.css";

const Home = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Thêm state để kiểm tra trạng thái tải dữ liệu

  useEffect(() => {
    configAppView({
      headerColor: "#8861bb",
      headerTextColor: "white",
      hideAndroidBottomNavigationBar: true,
      statusBarColor: "#8861bb",
      hideIOSSafeAreaBottom: true,
      actionBar: {
        title: "Danh sách học viên",
        leftButton: "back",
      },
      success: (res) => {},
      fail: (error) => {
        console.log(error);
      },
    });
  }, []);

  useEffect(() => {
    const phoneNumber = location?.state?.phoneNumber;
    console.log("Phone number từ login:", phoneNumber);

    if (phoneNumber) {
      // Gọi hàm để lấy danh sách học viên dựa trên số điện thoại
      getStudentsByPhoneNumber(phoneNumber);
    } else {
      console.error("Không tìm thấy số điện thoại");
    }
    // getStudentsByPhoneNumber(84368191416);
  }, [location]);

  const getStudentsByPhoneNumber = async (phoneNumber) => {
    try {
      // Gọi API để lấy danh sách học viên dựa trên số điện thoại
      const response = await axios.get(
        `https://ileader.cloud/api/MiniApp/GetListStudents?phone=${phoneNumber}`,
        { responseType: "json" }
      );

      // Xử lý dữ liệu trả về từ API
      setStudents(response.data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setIsLoading(false); // Đánh dấu rằng đã tải xong dữ liệu
    }
  };

  const handleItemClick = (student) => {
    const { student_FullName, studentGuid } = student;
    navigate("/DetailHome", {
      state: { studentName: student_FullName, studentGuid },
    });
    console.log("Selected student:", student_FullName);
    console.log("Selected studentGuid:", studentGuid);
  };

  return (
    <Page className="login-container">
      {/* Ẩn điều khiển chọn học viên nếu không có dữ liệu hoặc đang tải */}
      {!isLoading && students.length > 0 && (
        <Text.Title className="header-plc" style={{ textAlign: "center" }}>
          CHỌN HỌC VIÊN
        </Text.Title>
      )}
  
      {/* Hiển thị thông báo tải dữ liệu */}
      {isLoading && <Text>Loading...</Text>}
  
      {/* Hiển thị thông báo khi không có học viên */}
      {!isLoading && students.length === 0 && (
        <Text>Số điện thoại này không có đăng ký học viên tại trung tâm.</Text>
      )}
  
      {/* Hiển thị danh sách học viên nếu có */}
      {!isLoading && students.length > 0 && (
        <List>
          {students.map((student) => (
            <List.Item
              key={student.studentGuid}
              prefix={<Avatar>{student.Avatar}</Avatar>}
              title={student.student_FullName}
              subTitle={student.student_DateOfBirth}
              suffix={<Icon icon="zi-user" />}
              onClick={() => handleItemClick(student)}
            />
          ))}
        </List>
      )}
    </Page>
  );
  
};

export default Home;
