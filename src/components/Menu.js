import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  // Проверяем, есть ли токен в localStorage
  const isLogged = !!localStorage.getItem("token");

  // Извлекаем данные из localStorage
  const bonusBalance = localStorage.getItem("bonusBalance");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const handleLogout = () => {
    // Удаляем токен и другие данные пользователя
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("bonusBalance");

    // Перенаправляем на главную страницу
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Левый блок - текст "Coffee Machine" */}
        <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Coffee Machine
          </Button>

          {/* Отображение баланса справа от текста, если пользователь обычный */}
          {!isAdmin && bonusBalance && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              Bonus Balance: €{bonusBalance}
            </Typography>
          )}
        </Typography>

        {/* Правый блок - кнопки */}
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