import { Link } from "react-router-dom";

const LoginButton = () => {
  return (
    <Link to="/login">
      <button
        className={`px-5 py-2 rounded-sm font-bold bg-bkg1 text-txt1 border`}
      >
        Zaloguj się
      </button>
    </Link>
  );
};

export default LoginButton;
