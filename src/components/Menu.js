import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  // Проверяем, есть ли токен в localStorage
  const isLogged = !!localStorage.getItem("token");

  const handleLogout = () => {
    // Удаляем токен и другие данные пользователя
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");

    // Перенаправляем на главную страницу
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
           <Button color="inherit" onClick={() => navigate("/")}>
                Coffee Machine
              </Button>
        </Typography>

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