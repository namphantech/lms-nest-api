/**
 * @message
 */
export enum Message {
  /**
   * @all
   */
  FORBIDDEN_RESOURCE = 'You do not have permission to access this resource!',
  NO_PROFILE_EXISTS = 'No accounts exist',

  /**
   * @auth
   */
  DUPLICATE_EMAIL = 'This email has already been registered! Please use another Email!',
  WRONG_PASSWORD = 'Oh! The password is wrong, try to remember it!',
  WRONG_EMAIL = 'Wrong email! Can you help me check it again?',
  REGISTER_SUCCESS = 'Registration successful!',
  LOGIN_SUCCESS = 'Login successful!',
  LOGOUT_SUCCESS = 'Logout successful!',
  ACCOUNT_LOCKED = 'Your account has been locked, please contact your administrator for more details',
  INVALID_TOKEN = 'Invalid Token',

  /**
   * @recover
   */
  CHECK_EMAIL = 'Please check your email',
  EMAIL_NOT_FOUND = 'We have never seen such an Email! Please register an account!',
  WRONG_VERIFICATION_CODE = 'Invalid authentication code, please try again!',
  VERIFICATION_CODE_IS_CORRECT = 'User authentication successful!',
  EXPIRED_TOKEN = 'This token has expired!',
  PASSWORD_RESET_LINK_SENT = 'Password reset link has been sent to your email',

  /**
   * @user
   */
  PROFILE = 'This is your information',
  EDIT_PROFILE = 'Your information has been modified!',
  EDITING_EMAIL_ERROR = 'Same email, please update another email!',
  PROFILE_DELETED_SUCCESSFULLY = 'Your account has been deleted successfully!',
  PROFILE_PICTURE_UPDATED_SUCCESSFULLY = 'Your profile picture has been updated successfully!',
  INVALID_PASSWORD = 'Invalid password, please try again',
  ERROR_PASSWORD = 'Passwords do not match',
  CHANGE_PASSWORD_SUCCESSFULLY = 'Your password has been changed successfully',

  /**
   * @etc
   */
}
