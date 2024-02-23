import { useEffect, useState } from "react";
import { HOST_ADDRESS, CUSTOM_SERVER_CODE } from "../config/Enum";
import { useAuth } from "../context/AuthContext";

interface UserData {
  userID: number;
  userName: string;
  userDepartment: string;
  userRoomNumber: string;
  userFieldOfStudy: string;
  userImage: string;
  userEmail: string;
}

export const useUserData = () => {
  const { user } = useAuth();
  const [loggedUserData, setLoggedUserData] = useState<UserData | undefined>(
    undefined
  );
  const [fetchMessage, setFetchMessage] = useState<string | null>(null);

  const GetUserData = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    const response = await fetch(
      `${HOST_ADDRESS}/user/profile`,
      requestOptions
    );

    if (response.ok) {
      const data: UserData = await response.json();
      setLoggedUserData(data);
    } else {
      const msg: string = await response.headers.get("response-header");
      setFetchMessage(CUSTOM_SERVER_CODE[msg]);
    }
  };

  useEffect(() => {
    GetUserData();
  }, []);

  return { loggedUserData, fetchMessage };
};
