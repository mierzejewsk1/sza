import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CUSTOM_SERVER_CODE, HOST_ADDRESS } from "../config/Enum";
import { useAuth } from "../context/AuthContext";

const useLogout = () => {
  const { user, authActions } = useAuth();
  const [fetchMessage, setFetchMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const Logout = async () => {
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await fetch(`${HOST_ADDRESS}/user/logout`, requestOptions);

    if (response.ok) {
      await authActions.logout();
      navigate("/");
    } else {
      const msg: string = await response.headers.get("response-header");
      setFetchMessage(CUSTOM_SERVER_CODE[msg]);
    }
  };
  return { Logout, fetchMessage };
};

export default useLogout;
