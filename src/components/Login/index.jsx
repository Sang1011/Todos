import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "./login.css";
function Login() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  if (user) {
    navigate(`/todos`);
  }
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);   

  const [redirecting, setRedirecting] = useState(false); // State for handling redirect
  const [countdown, setCountdown] = useState(5); // Countdown for 5 seconds

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error on new login attempt

    // Fetch users from API
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        const user = res.data.find(
          (user) => user.email === email && user.phone === phone
        );

        if (user) {
          setLoading(false);
          alert("Login successful! Welcome " + user.name);

          localStorage.setItem("user", JSON.stringify(user));
          setRedirecting(true);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(interval);
                navigate(`/todos`); // Redirect to /todos after countdown ends
              }
              return prev - 1;
            });
          }, 1000); // Decrease countdown every second
        } else {
          setLoading(false);
          setError("Invalid email or phone number.");
        }
      })
      .catch((err) => {
        setLoading(false);
        setError("Error fetching data.");
        console.error(err);
      });
  };

  return (
    <div className="LoginForm">
      <form className="Form" onSubmit={handleSubmit}>
      <h2 className="loginText">Login</h2>
      <div className="under">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}   
            required
          />
        </div>
        <div>
          <label htmlFor="phone">Phone:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div style={{display: "flex", justifyContent: "center"}}>
        <button style={{width: "50%", padding: "10px", backgroundColor: "green", color: "white"}} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        </div>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {redirecting && (
        <p>You will be redirected in {countdown} seconds...</p>
      )}
    </div>
  );
}

export default Login;