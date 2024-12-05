import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Input,
  Link,
} from "@mui/material";

const CreateDrink = () => {
  // Joogi nime, kirjelduse, hinna ja pildi jaoks loodud olekud
  const [name, setName] = useState(""); // Joogi nimi
  const [description, setDescription] = useState(""); // Joogi kirjeldus
  const [price, setPrice] = useState(""); // Joogi hind
  const [image, setImage] = useState(null); // Joogi pilt
  const navigate = useNavigate(); // Navigeerimise funktsioon lehe muutmiseks
  const API_URL = process.env.REACT_APP_API_URL;
  document.title = "Admin Panel - Create Drink"; // Lehe tiitli muutmine

  // Vormist saadetud andmete töötlemise funktsioon
  const handleSubmit = (e) => {
    e.preventDefault(); // Väldime lehe taaskäivitumist
    const formData = new FormData(); // Loome uue FormData objekti, et saata vormiandmeid
    formData.append("Name", name); // Lisame joogi nime
    formData.append("Description", description); // Lisame joogi kirjelduse
    formData.append("Price", price); // Lisame joogi hinna
    formData.append("Image", image); // Lisame joogi pildi

    // Saadame POST-päringu serverile joogi loomiseks
    axios
      .post(`${API_URL}/drinks`, formData) // API aadress
      .then(() => navigate("/")) // Kui õnnestub, suuname kasutaja tagasi avalehele
      .catch((error) => console.error("Error creating drink:", error)); // Kui tekib viga, logime selle
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Create New Drink
      </Typography>
      {/* Vorm joogi loomiseks */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Tekstiväli joogi nime jaoks */}
        <TextField
          label="Name" // Väli pealkirjaga "Nimi"
          value={name}
          onChange={(e) => setName(e.target.value)} // Muudab nime olekus
          required // Väli on kohustuslik
        />
        {/* Tekstiväli joogi kirjelduse jaoks */}
        <TextField
          label="Description" // Väli pealkirjaga "Kirjeldus"
          multiline // Lubab mitut rida teksti
          rows={4} // 4 rida teksti
          value={description}
          onChange={(e) => setDescription(e.target.value)} // Muudab kirjelduse olekus
        />
        {/* Tekstiväli joogi hinna jaoks */}
        <TextField
          label="Price" // Väli pealkirjaga "Hind"
          type="number" // Numbriline sisend
          value={price}
          onChange={(e) => setPrice(e.target.value)} // Muudab hinna olekus
          required // Väli on kohustuslik
          inputProps={{ min: 0, step: 0.01 }} // Minimaalne väärtus 0, sammuga 0.01
        />
        {/* Nupu komponent pildi üleslaadimiseks */}
        <Button
          variant="outlined"
          component="label"
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            textTransform: "none",
            color: "rgba(0, 0, 0, 0.87)",
          }}
        >
          Upload File
          {/* Faili sisestamise sisend */}
          <Input
            type="file"
            onChange={(e) => setImage(e.target.files[0])} // Määrab faili olekusse
            required // Väli on kohustuslik
            sx={{ display: "none" }} // Peidetud vaikimisi
          />
        </Button>
        {/* Nupp vormi esitamiseks */}
        <Button variant="contained" type="submit">
          Create
        </Button>
        {/* Tagasilink avalehele */}
        <Link
          href="/"
          underline="hover"
          sx={{
            mt: 2,
            display: "inline-block",
            fontSize: "16px",
            color: "primary.main",
            "&:hover": { textDecoration: "underline", color: "primary.dark" },
          }}
        >
          Back
        </Link>
      </Box>
    </Container>
  );
};

export default CreateDrink;