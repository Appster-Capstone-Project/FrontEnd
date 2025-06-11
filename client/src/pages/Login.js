import { useState } from "react";
import { loginUser, registerUser } from "../api/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await loginUser(email, password);
    alert(response.message);
  };

  const handleSignUp = async () => {
    const response = await registerUser(email, password);
    alert(response.message);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Login / Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: "10px", padding: "10px" }}
      />
      <br />
      <button onClick={handleLogin} style={{ margin: "5px" }}>Login</button>
      <button onClick={handleSignUp} style={{ margin: "5px" }}>Sign Up</button>
    </div>
  );
}

export default Login;
