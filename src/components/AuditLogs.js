import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuditLogs = async () => {
       const userRole = localStorage.getItem("isAdmin"); // Допустим, мы сохраняем информацию о роли пользователя в localStorage
        if (userRole !== "true") {
          navigate("/");
        }
      try {
        const response = await axios.get(`https://localhost:7198/api/Logs?userId=2&logs=audit&token=${localStorage.getItem("token")}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAuditLogs(response.data);
      } catch (err) {
        setError("Failed to fetch audit logs.");
        console.error(err);
      }
    };

    fetchAuditLogs();
  }, []);

  return (
    <Container>
       <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Audit Log
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Table Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Action</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Entity ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Old Values</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>New Values</TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '16px', backgroundColor: '#f0f0f0' }}>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.tableName}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.entityId}</TableCell>
                <TableCell>{log.oldValues}</TableCell>
                <TableCell>{log.newValues}</TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AuditLogs;