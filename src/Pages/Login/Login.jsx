import { useEffect, useState } from "react";
import "./Login.css";
import { FaBookReader, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  const { Login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      try {
        await Login(email, password);
      } catch (err) {
        setError("Invalid email or password");
        console.error(err);
      }
    }
  }
  useEffect(
    function () {
      if (isAuthenticated) navigate("/dashboard", { replace: true });
    },
    [isAuthenticated, navigate],
  );

  function handlePasswordReveal() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <main className="login">
      <div className="login-desc">
        <h1>
          <span>
            <FaBookReader size={12} />
          </span>
          StudyDesk
        </h1>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="row">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="row">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <button type="button" onClick={handlePasswordReveal}>
              {isOpen ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            <input
              type={isOpen ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="loginError">{error}</p>}
        <div>
          <button type="submit">Login</button>
        </div>
      </form>
    </main>
  );
}

export default Login;
