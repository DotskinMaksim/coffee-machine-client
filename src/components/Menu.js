import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  // Kontrollime, kas on olemas token localStorage-s
  const isLogged = !!localStorage.getItem("token");

  // Loeme vajalikud andmed localStorage-st
  const bonusBalance = localStorage.getItem("bonusBalance");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Sisselogimisest väljumise käsitleja
  const handleLogout = () => {
    // Eemaldame kõik kasutaja andmed localStorage-st
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("bonusBalance");

    // Suuname kasutaja põhilehele pärast väljumist
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Vasakpoolne blokk - tekst "Coffee Machine" */}
        <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Coffee Machine
          </Button>

          {/* Kuvame kasutaja boonussaldo, kui tegemist ei ole administraatoriga */}
          {!isAdmin && bonusBalance && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              Bonus Balance: €{bonusBalance}
            </Typography>
          )}
        </Typography>

        {/* Parempoolne blokk - sisselogimise/väljalogimise nupud */}
        <Box>
          {isLogged ? (
            <>
              <Button color="inherit" onClick={handleLogout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/register")}>
                Register
              </Button>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Log In
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Menu;