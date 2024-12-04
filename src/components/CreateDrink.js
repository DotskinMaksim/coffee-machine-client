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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  document.title = "Admin Panel - Create Drink";

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", name);
    formData.append("Description", description);
    formData.append("Image", image);

    axios
      .post("https://localhost:7198/api/drinks", formData)
      .then(() => navigate("/"))
      .catch((error) => console.error("Error creating drink:", error));
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Create New Drink
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
          <Input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
            sx={{ display: "none" }}
          />
        </Button>
        <Button variant="contained" type="submit">
          Create
        </Button>
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