export interface UserBase {
  name: string;
  last_name: string;
  last_name2: string;
  gender: string;
  birth_date: string;
  email: string,
}

export interface RegisterData extends UserBase {
    password: string,
    password_confirmation: string;
} 
export interface LoginData {
  email: string;
  password: string;
}

export interface data2FA {
  email: string;
  code: string;
}

export interface updateUserData extends UserBase {
  password_confirmation: string;
}

export interface checkPassword {
  current_password: string;
}

export interface changePassword {
  password: string;
  password_confirmation: string;
}