import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const LoginLogs = () => {
  const [loginLogs, setLoginLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoginLogs = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/Logs?userId=2&logs=login&token=${localStorage.getItem("token")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setLoginLogs(response.data);
      } catch (err) {
        setError("Failed to fetch login logs.");
        console.error(err);
      }
    };

    fetchLoginLogs();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login Logs</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Success</TableCell>
              <TableCell>Login Method</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loginLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user.email}</TableCell>
                <TableCell>{new Date(log.loginTime).toLocaleString()}</TableCell>
                <TableCell>{log.ipAddress}</TableCell>
                <TableCell>{log.isSuccess ? "Yes" : "No"}</TableCell>
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