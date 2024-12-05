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
  // Loodud seisundid e-posti, parooli ja vea sõnumite jaoks
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Kasutame navigeerimise võimalust pärast edukat sisselogimist

  // Käideldakse vormi esitamist
  const handleSubmit = async (e) => {
    e.preventDefault(); // Takistab lehe värskendamist
    setError(null); // Eemaldame eelnevad veateated

    try {
      // Teeme POST-päringu sisselogimiseks
      const response = await axios.post("https://localhost:7198/api/auth/login", {
        email,
        password,
      });

      console.log("Response data:", response.data); // Kuvame vastuse andmed konsoolis

      // Kontrollime, kas vastus sisaldab kõiki vajalikud andmeid
      if (response.data && response.data.token && response.data.userId !== undefined && response.data.isAdmin !== undefined) {
        // Salvestame vastuse andmed localStorage-sse
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("isAdmin", response.data.isAdmin);
        localStorage.setItem("bonusBalance", response.data.bonusBalance);

        navigate("/"); // Ümber suunamine põhilehele pärast sisselogimist
      } else {
        console.error("Received data is missing expected fields:", response.data);
        setError("Server returned incomplete data"); // Kui puudu on vajalikud andmed
      }

    } catch (err) {
      // Kuvame vea, kui sisselogimine ebaõnnestub
      console.error("Login error:", err.response?.data);
      setError(err.response?.data || "Invalid credentials!"); // Kui pole täpsemat teavet, siis kuvatakse üldine teade
    }
  };

  return (
    <Container maxWidth="sm">
      {/* Pealkiri */}
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Login
      </Typography>
      {/* Kuvame vea, kui see on olemas */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Email" // E-posti sisendi väli
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password" // Parooli sisendi väli
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