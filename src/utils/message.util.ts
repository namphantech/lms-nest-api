export enum MESSAGE {
  INVALID_ID_USER = 'ID của bạn đã không tồn tại hihi',
  SIGNUP_FAILED = 'Email này đã có người đăng kí sử dụng rồi! Vui lòng sử dụng Email khác!',
  WRONG_PASSWORD = 'Ôi! Sai mật khẩu rồi nè, bạn cố nhớ thử xem!',
  WRONG_EMAIL = 'Sai email rồi nè! Bạn kiểm tra lại giúp mình nha',

  CHECK_EMAIL = 'Vui lòng kiểm tra Email',
  EMAIL_NOT_FOUND = 'Chúng tôi chưa từng thấy Email nào như vậy! Vui lòng đăng kí tài khoản!',
  WRONG_VERIFICATION_CODE = 'Mã xác thực sai, vui lòng thử lại!',
  VERIFICATION_CODE_IS_CORRECT = 'Xác thực người dùng thành công!',
  INVALID_TOKEN = 'Token này đã hết hạn!',

  EDIT_PROFILE = 'Thông tin của bạn đã được sửa đổi',
  EDITING_ERROR = 'Đã trùng với một email khác, vui lòng cập nhật email khác!',

  NO_PROFILE_EXISTS = 'Không tồn tại bất kì tài khoản nào',

  FORBIDDEN_RESOURCE = 'Bạn không có quyền truy cập tài nguyên này!',

  PRODUCT_REMOVED = 'Bạn đã xoá sản phẩm thành công!',
  PRODUCTS_REMOVED = 'Bạn đã xoá tất cả sản phẩm thành công!',

  UPLOAD_ERROR_FILE = 'Tệp không được trống!',
  NOT_CORRECT_CODE = 'Bạn đã nhập sai mã rùi',
  CORRECT_CODE = 'Bạn đã nhập mã đúng rùi nha',
  NOT_TYPED_PASS = 'Hình như bạn vẫn chưa nhập mật khẩu!',
  SUCCESS_UPDATED_PASSWORD = 'Bạn đã đổi mật khẩu thành công',
}
