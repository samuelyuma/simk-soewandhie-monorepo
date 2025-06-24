import { Role } from "../../../src/generated/prisma";

export const UserData = [
	{
    id: "CQcdqsmRbcRnSVJkes",
    nama: "SUPERADMIN",
    username: "superadmin",
    password: "superadmin1234",
    nip: "-",
    is_active: true,
    role: Role.SUPERADMIN,
  },
  {
    id: "GuCGsDGEzchSuAomLC",
    nama: "ADMIN",
    username: "admin",
    password: "admin4321",
    nip: "-",
    is_active: true,
    role: Role.ADMIN,
  },
]