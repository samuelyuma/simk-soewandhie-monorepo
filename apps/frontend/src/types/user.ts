export type Jabatan = {
  id: number;
  nama: string;
  keterangan: string;
};

export type User = {
  id: string;
  nama: string;
  username?: string;
  is_active: boolean;
  role: "ADMIN" | "SUPERADMIN";
  list_jabatan: Array<{
    id: number;
    jabatan: Jabatan;
  }>;
  nip: string;
};

export interface CreateUser extends Omit<User, "id" | "list_jabatan" | "role"> {
  password: string;
  list_jabatan: Array<{
    jabatan_id: number;
  }>;
}

export interface UpdateUser extends Omit<User, "id" | "list_jabatan" | "role"> {
  password: string | undefined;
  list_jabatan: Array<{
    id: number;
    jabatan_id: number;
  }>;
  new_jabatan_list?: Array<{
    jabatan_id: number;
  }>;
  removed_jabatan_list?: Array<{
    id: number;
  }>;
}

export type AuthRequest = {
  username: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  role: "ADMIN" | "SUPERADMIN";
};
