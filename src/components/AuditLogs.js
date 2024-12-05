import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        const response = await axios.get(`${process.env.API_URL}/Logs?userId=2&logs=audit&token=${localStorage.getItem("token")}`, {
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
      <Typography variant="h4" gutterBottom>Audit Logs</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Table Name</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Entity ID</TableCell>
              <TableCell>Old Values</TableCell>
              <TableCell>New Values</TableCell>
              <TableCell>Timestamp</TableCell>
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