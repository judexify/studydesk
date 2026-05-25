import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Logout.css";

function Logout() {
  const { Logout, currentLoggedInUser } = useAuth();

  const navigate = useNavigate();

  function handleSubmit() {
    Logout();
    navigate("/");
  }

  return (
    <div className="logout-module">
      <img
        src={currentLoggedInUser?.user_metadata?.avatar}
        alt={`${currentLoggedInUser} image`}
      />
      <span>{currentLoggedInUser.user_metadata?.name}</span>
      <button type="button" onClick={handleSubmit}>
        Logout
      </button>
    </div>
  );
}
export default Logout;
