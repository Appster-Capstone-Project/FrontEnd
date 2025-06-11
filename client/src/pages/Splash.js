import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/login");
    }, 3000); // wait 3 seconds
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <img src="/logo.png" alt="TiffinBox Logo" width="200" />
      <h2>Welcome to TiffinBox</h2>
    </div>
  );
}

export default Splash;
