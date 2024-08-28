export type UserLoginData = {
  login: string;
  password: string;
};
export type UserType = {
  name: string;
  surname: string;
  patronymic: string;
  login: string;
  phone: string;
  email: string;
  password: string;
  profile_image?: string;
  id: number;
  role_id?: number;
  createdAt?: string;
  updatedAt?: string;
};
export type UserReg = Omit<
  UserType,
  "id" | "role_id" | "createdAt" | "updatedAt"
>;
