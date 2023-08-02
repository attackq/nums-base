export interface User {
  id: number;
  role: string;
  username: string;
  password: string;
  lastName: string;
  createdAt: number;
  tokenId: string;
}

export interface EditedUser {
  username: string;
  lastName: string;
}
