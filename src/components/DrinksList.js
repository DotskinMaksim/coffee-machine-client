import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Container,
} from "@mui/material";

const DrinksList = () => {
  const [drinks, setDrinks] = useState([]);

  useEffect(() => {
      document.title = "Admin Panel - Drinks List";
    axios
      .get("https://localhost:7198/api/Drinks")
      .then((response) => setDrinks(response.data))
      .catch((error) => console.error("Error fetching drinks:", error));
  }, []);

  const deleteDrink = (id) => {
    if (window.confirm("Are you sure you want to delete this drink?")) {
      axios
        .delete(`https://localhost:7198/api/drinks/${id}`)
        .then(() => setDrinks(drinks.filter((drink) => drink.id !== id)))
        .catch((error) => console.error("Error deleting drink:", error));
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Drinks List
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" component={Link} to="/create">
          Create New Drink
        </Button>
      </Box>
      <Grid container spacing={3}>
        {drinks.map((drink) => (
          <Grid item xs={12} sm={6} md={4} key={drink.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={drink.imageUrl}
                alt={drink.name}
              />
              <CardContent>
                <Typography variant="h6">{drink.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {drink.description}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => deleteDrink(drink.id)}
                >
                  Delete
                </Button>
                <Button variant="contained" component={Link} to={`/edit/${drink.id}`}>
                  Edit
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DrinksList;