export interface UserBase {
  name: string;
  last_name: string;
  last_name2: string;
  gender: number;
  birth_date: string;
  email: string,
  password: string,
}

export interface RegisterData extends UserBase {
    password_confirmation: string;
} 
