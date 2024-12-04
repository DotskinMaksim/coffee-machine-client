import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DrinksList from "./components/DrinksList";
import CreateDrink from "./components/CreateDrink";
import EditDrink from "./components/EditDrink";
import Footer from "./components/Footer";

function App() {
  return (
   <Router>
       <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
           <h1 style={{textAlign: "center", margin: "20px 0"}}>Drinks - Admin Panel</h1>
           <Routes>
               <Route path="/" element={<DrinksList/>}/>
               <Route path="/create" element={<CreateDrink/>}/>
               <Route path="/edit/:id" element={<EditDrink/>}/>
           </Routes>
           <Footer/>
       </div>
   </Router>
  );
}

export default App;