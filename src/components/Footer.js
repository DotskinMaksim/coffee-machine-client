import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer" // Kasutame Box komponenti, et luua jalg (footer)
      sx={{
        backgroundColor: "#1976d2", // Taustavärv sinine
        color: "#fff", // Tekstivärv valge
        py: 2, // Ülemine ja alumine täidis (padding) 2 ühikut
        textAlign: "center", // Teksti tsentreerimine
        mt: "auto", // Jalaga kohandatud kaugus ülejäänud sisu suhtes
      }}
    >
      {/* Typography komponent, et kuvada teksti */}
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        Coffee Machine | Maksim Dotskin TARpv22
      </Typography>
    </Box>
  );
};

export default Footer;