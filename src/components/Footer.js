import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#1976d2",
        color: "#fff",
        py: 2,
        textAlign: "center",
        mt: "auto",
      }}
    >
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Drinks Admin Panel | Maksim Dotskin TARpv22
      </Typography>
    </Box>
  );
};

export default Footer;