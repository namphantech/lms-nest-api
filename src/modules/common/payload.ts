export default interface PayloadInToken {
  userID: number;
  userEmail: string;
  userRole: number | string;
  refreshToken?: string;
}
