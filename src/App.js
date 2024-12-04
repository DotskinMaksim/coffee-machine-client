import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DrinksList from "./components/DrinksList";
import CreateDrink from "./components/CreateDrink";
import EditDrink from "./components/EditDrink";

function App() {
  return (
    <Router>
      <div>
        <h1>Coffee Machine Admin Panel</h1>
        <Routes>
          <Route path="/" element={<DrinksList />} />
          <Route path="/create" element={<CreateDrink />} />
          <Route path="/edit/:id" element={<EditDrink />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;