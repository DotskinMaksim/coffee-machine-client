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
  CircularProgress,
  Alert,
} from "@mui/material";

const DrinksList = () => {
  // Loome olekud jookide, töötlemisolekute, valitud joogi ID ja admin õiguste hoidmiseks
  const [drinks, setDrinks] = useState([]); // Hoidke kõik joogid olekus
  const [isProcessing, setIsProcessing] = useState(false); // Kas jooki töödeldakse
  const [selectedDrinkId, setSelectedDrinkId] = useState(null); // Valitud joogi ID
  const [isAdmin, setIsAdmin] = useState(false); // Kas kasutajal on administraatori õigused

  useEffect(() => {
    document.title = "Drinks List"; // Määrame lehe tiitli
    // Kontrollime, kas kasutaja on administraator
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);

    const token = localStorage.getItem("token"); // Kasutaja autentimise token
    const isLogged = !!token; // Kontrollime, kas kasutaja on sisse logitud

    // Teeme GET-päringu, et saada kõik joogid vastavalt sisselogimise ja administraatori staatusele
    axios
      .get("https://localhost:7198/api/Drinks", {
        params: {
          isLogged: isLogged,
          isAdmin: adminStatus
        },
      })
      .then((response) => setDrinks(response.data)) // Kui päring õnnestub, salvestame joogid
      .catch((error) => console.error("Error fetching drinks:", error)); // Kui päring ebaõnnestub, logime vea
  }, []);

  // Funktsioon joogi ettevalmistamiseks (näiteks kui kasutaja ei ole administraator)
  const handlePrepareDrink = (id) => {
    setIsProcessing(true); // Määrame töötlemisoleku True
    setSelectedDrinkId(id); // Määrame valitud joogi ID

    // Kui töötlemine on lõpetatud (5 sekundi pärast), näitame alerti
    setTimeout(() => {
      setIsProcessing(false); // Määrame töötlemisoleku False
      setSelectedDrinkId(null); // Tühjendame valitud joogi ID
      alert("Your drink is ready. You can take it!"); // Näitame sõnumi
    }, 5000);
  };

  // Funktsioon joogi kustutamiseks
  const deleteDrink = (id) => {
    if (window.confirm("Are you sure you want to delete this drink?")) { // Küsimus kustutamise kinnitamiseks
      axios
        .delete(`https://localhost:7198/api/drinks/${id}`) // Teeme DELETE-päringu
        .then(() => setDrinks(drinks.filter((drink) => drink.id !== id))) // Kui päring õnnestub, eemalda jook loendist
        .catch((error) => console.error("Error deleting drink:", error)); // Kui päring ebaõnnestub, logime vea
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4, mt: 2 }}>
        Drinks List
      </Typography>
      {/* Kui kasutaja on administraator, kuvame nuppu uue joogi loomiseks */}
      {isAdmin && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" component={Link} to="/create">
            Create New Drink
          </Button>
        </Box>
      )}
      {/* Kuvame kõik joogid Grid-komponendis */}
      <Grid container spacing={3}>
        {drinks.map((drink) => (
          <Grid item xs={12} sm={6} md={4} key={drink.id}>
            <Card>
              {/* Joogi pildi kuvamine */}
              <CardMedia
                component="img"
                height="140"
                image={drink.imageUrl}
                alt={drink.name}
              />
              <CardContent>
                {/* Joogi nime kuvamine */}
                <Typography variant="h6">{drink.name}</Typography>
                {/* Joogi kirjelduse kuvamine */}
                <Typography variant="body2" color="text.secondary">
                  {drink.description}
                </Typography>
                {/* Joogi hinna kuvamine */}
                <Typography variant="body1" sx={{ mt: 1 }}>
                  <strong>Price:</strong>{" "}
                  {drink.price !== undefined && drink.price !== null
                    ? `€${drink.price.toFixed(2)}`
                    : "Price not available"} {/* Kui hind on saadaval, kuvame selle */}
                </Typography>
              </CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
                {/* Kui kasutaja on administraator, kuvame nupud kustutamiseks ja redigeerimiseks */}
                {isAdmin ? (
                  <>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => deleteDrink(drink.id)} // Kustutamise nupp
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/edit/${drink.id}`} // Redigeerimise nupp
                    >
                      Edit
                    </Button>
                  </>
                ) : (
                  // Kui kasutaja ei ole administraator, kuvame nupu joogi valmistamiseks
                  <Button
                    variant="contained"
                    disabled={isProcessing} // Kui töötlemine on käimas, nupp on keelatud
                    onClick={() => handlePrepareDrink(drink.id)} // Kutsume ettevalmistamise funktsiooni
                  >
                    {isProcessing && selectedDrinkId === drink.id ? (
                      // Kui joogi töötlemine on käimas, kuvame laadimisrattast
                      <CircularProgress size={24} sx={{ color: "white" }} />
                    ) : (
                      "Prepare" // Kui töötlemine ei käi, kuvame "Prepare"
                    )}
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default DrinksList;