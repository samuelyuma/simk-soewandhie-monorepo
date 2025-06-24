import Cookies from "universal-cookie";

const cookies = new Cookies();

export const setToken = (token: string) => {
  cookies.set("e-payment", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
  });
};

export const removeToken = () => cookies.remove("e-payment");
