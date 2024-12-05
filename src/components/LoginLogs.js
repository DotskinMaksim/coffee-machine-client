import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Импортируем useNavigate

const LoginLogs = () => {
  const [loginLogs, setLoginLogs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Используем navigate для перенаправления

  useEffect(() => {
    const fetchLoginLogs = async () => {
       const userRole = localStorage.getItem("isAdmin"); // Допустим, мы сохраняем информацию о роли пользователя в localStorage
        if (userRole !== "true") {
          navigate("/");
        }
      try {
        // Получаем информацию о пользователе
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://localhost:7198/api/Logs?userId=2&logs=login&token=${token}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });



        setLoginLogs(response.data);
      } catch (err) {
        setError("Failed to fetch login logs.");
        console.error(err);
      }
    };

    fetchLoginLogs();
  }, [navigate]); // Добавляем navigate в зависимость useEffect

  return (
    <Container>
       <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Login Logs
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>User</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Login Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>IP Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Result</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Login Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loginLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.userEmail}</TableCell>
                <TableCell>{new Date(log.loginTime).toLocaleString()}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>{log.result}</TableCell>
                <TableCell>{log.loginMethod}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default LoginLogs;