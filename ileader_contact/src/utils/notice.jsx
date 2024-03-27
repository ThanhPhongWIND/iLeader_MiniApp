

const sendCheckedStateToServer = async (regGuid, checkedState) => {
    try {
      // Gửi yêu cầu POST đến server để cập nhật trạng thái checked của thông báo
      await axios.post('URL_API', {
        guid: regGuid,
        checked: checkedState
      });
      console.log('Trạng thái checked đã được gửi thành công lên server');
    } catch (error) {
      console.error('Lỗi khi gửi trạng thái checked lên server:', error);
    }
  };