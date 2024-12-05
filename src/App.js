import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DrinksList from "./components/DrinksList";
import CreateDrink from "./components/CreateDrink";
import EditDrink from "./components/EditDrink";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Menu from "./components/Menu";

function App() {
  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Menu />

        <Routes>
          <Route path="/" element={<DrinksList />} />
          <Route path="/create" element={<CreateDrink />} />
          <Route path="/edit/:id" element={<EditDrink />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;