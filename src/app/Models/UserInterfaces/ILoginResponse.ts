export interface ILoginResponse {
    user: IUSerFromLogin;
    token: string;
    role: string;
    cartCount: number;
    wishCount: number;
  }
  
  export interface IUSerFromLogin {
    firstName: string;
    lastname: string;
    gender: string;
    address: string;
    profileImage: string;
    id:string;
    userName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
  }