import React, {useEffect, useState} from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState(""); // E-posti väärtus
  const [password, setPassword] = useState(""); // Parooli väärtus
  const [confirmPassword, setConfirmPassword] = useState(""); // Kinnitamise parooli väärtus
  const [error, setError] = useState(null); // Viga registreerimise ajal
  const [success, setSuccess] = useState(false); // Kas registreerimine õnnestus
  const navigate = useNavigate(); // Kasutame navigeerimise võimalust pärast edukat sisselogimist
  const API_URL = process.env.API_URL;

  useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/");
      }
    }, [navigate]);

  // Registreerimisvormi saatmise käsitleja
  const handleSubmit = async (e) => {
    e.preventDefault(); // Vältida lehe värskendamist vormi esitamisel
    setError(null); // Eelmise vea tühistamine
    setSuccess(false); // Eelmise eduka sõnumi tühistamine

    try {
      // Saame API-le POST päringu kasutaja andmetega
      const response = await axios.post(`https://localhost:7198/api/auth/register`, {
        email,
        password,
        confirmPassword,
      });
      setSuccess(true); // Registreerimine õnnestus
    } catch (err) {
      setError(err.response?.data || "Something went wrong!"); // Näita viga, kui midagi läks valesti
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Register
      </Typography>
      {/* Kuvame vea teate */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {/* Kuvame edukat registreerimise sõnumit */}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Registration successful!</Alert>}
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
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Box>
        <Button variant="contained" type="submit">
          Register
        </Button>
      </form>
    </Container>
  );
};

export default Register;