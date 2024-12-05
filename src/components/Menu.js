import React, { useState } from "react";
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MenuComponent = () => {
  const navigate = useNavigate();

  // Состояние для управления открытием/закрытием выпадающего списка
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Проверка на наличие токена в localStorage
  const isLogged = !!localStorage.getItem("token");

  // Получаем данные из localStorage
  const bonusBalance = localStorage.getItem("bonusBalance");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  // Обработчик выхода из системы
  const handleLogout = () => {
    // Убираем данные из localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("bonusBalance");

    // Перенаправляем пользователя на главную страницу
    window.location.reload();
    navigate("/");
  };

  // Открытие выпадающего меню
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Закрытие выпадающего меню
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Обработчики для перехода на страницы
  const handleLoginLogsClick = () => {
    navigate("/login-logs");
    handleMenuClose();  // Закрываем меню при переходе
  };

  const handleAuditLogsClick = () => {
    navigate("/audit-logs");
    handleMenuClose();  // Закрываем меню при переходе
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/")}>
            Coffee Machine
          </Button>

          {/* Отображение баланса и кнопки Logs рядом с ним для администратора */}
          {!isAdmin && bonusBalance && (
            <Typography variant="subtitle1" sx={{ ml: 2 }}>
              Bonus Balance: €{bonusBalance}
            </Typography>
          )}

          {isAdmin && (
            <Button color="inherit" onClick={handleMenuClick} sx={{ ml: 2 }}>
              Logs
            </Button>
          )}
        </Typography>

        <Box>
          {isLogged ? (
            <>
              {isAdmin && (
                <Menu
                  anchorEl={anchorEl}
                  open={openMenu}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleLoginLogsClick}>Login Logs</MenuItem>
                  <MenuItem onClick={handleAuditLogsClick}>Audit Logs</MenuItem>
                </Menu>
              )}

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

export default MenuComponent;