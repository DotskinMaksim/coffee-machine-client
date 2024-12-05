import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

const EditDrink = () => {
  const { id } = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // Добавляем состояние для цены
  const navigate = useNavigate();
  document.title = "Admin Panel - Edit Drink";

  useEffect(() => {
    axios
      .get(`https://localhost:7198/api/drinks/${id}`)
      .then((response) => {
        setName(response.data.name);
        setDescription(response.data.description);
        setPrice(response.data.price); // Получаем цену из API
      })
      .catch((error) => console.error("Error fetching drink:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(`https://localhost:7198/api/drinks/${id}`, {
        Name: name,
        Description: description,
        Price: parseFloat(price), // Передаем цену на сервер
      })
      .then(() => navigate("/"))
      .catch((error) => console.error("Error updating drink:", error));
  };

 return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Edit Drink
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Price" // Поле для цены
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          inputProps={{ min: 0, step: 0.01 }} // Ограничения: минимум 0, шаг 0.01
        />
        <Button variant="contained" type="submit">
          Save
        </Button>
        <Link
          to="/"
          style={{
            marginTop: "16px",
            textDecoration: "none",
            fontSize: "16px",
            color: "#1976d2",
          }}
        >
          Back
        </Link>
      </Box>
    </Container>
  );
};

export default EditDrink;