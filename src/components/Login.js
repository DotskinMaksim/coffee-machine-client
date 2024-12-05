import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  try {
    const response = await axios.post("https://localhost:7198/api/auth/login", {
      email,
      password,
    });

    console.log("Response data:", response.data); // Выводим данные, полученные от API

    if (response.data && response.data.token && response.data.userId !== undefined && response.data.isAdmin !== undefined) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("isAdmin", response.data.isAdmin);
      localStorage.setItem("bonusBalance", response.data.bonusBalance);


      navigate("/");
    } else {
      console.error("Received data is missing expected fields:", response.data);
      setError("Server returned incomplete data");
    }

  } catch (err) {
    console.error("Login error:", err.response?.data);
    setError(err.response?.data || "Invalid credentials!");
  }
};
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Login
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Box>
        <Button variant="contained" type="submit">
          Login
        </Button>
      </form>
    </Container>
  );
};

export default Login;