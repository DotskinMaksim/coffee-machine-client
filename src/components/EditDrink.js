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
  // Id, mis saadakse URL parameetrist
  const { id } = useParams();
  // Joogi nime, kirjelduse ja hinna olekud
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); // Hind lisatakse olekusse
  const navigate = useNavigate();
  document.title = "Admin Panel - Edit Drink"; // Lehe pealkirja seadistamine

  // Kasutame useEffecti, et saada andmed API-lt, kui komponent laadib
  useEffect(() => {
    axios
      .get(`https://localhost:7198/api/drinks/${id}`) // Päring andmete saamiseks vastavalt ID-le
      .then((response) => {
        setName(response.data.name); // Määrame nime
        setDescription(response.data.description); // Määrame kirjelduse
        setPrice(response.data.price); // Määrame hinna
      })
      .catch((error) => console.error("Error fetching drink:", error)); // Kui API päring ebaõnnestub
  }, [id]); // Effect käivitub iga kord, kui id muutub

  // Vormil saadud andmete saatmine
  const handleSubmit = (e) => {
    e.preventDefault(); // Vormil saadud andmete saatmise vältimiseks
    axios
      .put(`https://localhost:7198/api/drinks/${id}`, {
        Name: name, // Saatke uus nimi
        Description: description, // Saatke uus kirjeldus
        Price: parseFloat(price), // Saatke hind, tagame, et see on number
      })
      .then(() => navigate("/")) // Kui kõik õnnestub, suuname tagasi põhilehele
      .catch((error) => console.error("Error updating drink:", error)); // Kui API päring ebaõnnestub
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Edit Drink
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit} // Vormi esitamist käsitlev funktsioon
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Sisendväli joogi nime jaoks */}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)} // Kui väli muutub, uuendame nime olekut
          required
        />
        {/* Sisendväli joogi kirjelduse jaoks */}
        <TextField
          label="Description"
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Kui väli muutub, uuendame kirjelduse olekut
        />
        {/* Sisendväli joogi hinna jaoks */}
        <TextField
          label="Price" // Hind on vajalik väli
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)} // Kui väli muutub, uuendame hinna olekut
          required
          inputProps={{ min: 0, step: 0.01 }} // Hind peab olema vähemalt 0 ja samm 0.01
        />
        {/* Vormi esitamise nupp */}
        <Button variant="contained" type="submit">
          Save
        </Button>
        {/* Link tagasitulekuks põhilehele */}
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