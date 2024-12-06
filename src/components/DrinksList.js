import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';

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
  Radio,
  RadioGroup,
  FormControlLabel,
  Slider,
  Checkbox,
  TextField,
    FormControl,
} from "@mui/material";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ConfirmButton = styled(Button)`
  background-color: #4caf50;

  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
    color: white;
  &:hover {
    background-color: #e53935;
  }
`;
const DrinksList = () => {
  // Loome olekud jookide, töötlemisolekute, valitud joogi ID ja admin õiguste hoidmiseks
  const [drinks, setDrinks] = useState([]); // Hoidke kõik joogid olekus
  const [isProcessing, setIsProcessing] = useState(false); // Kas jooki töödeldakse
  const [selectedDrinkId, setSelectedDrinkId] = useState(null); // Valitud joogi ID
  const [isAdmin, setIsAdmin] = useState(false); // Kas kasutajal on administraatori õigused
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentWindow, setPaymentWindow] = useState(null);  // Manage window state
    const [isModalOpen, setIsModalOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(null);  // Manage interval state
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
    const [customizingDrink, setcustomizingDrink] = useState(false);
  const [customizingDrinkId, setcustomizingDrinkId] = useState(null); // Valitud joogi ID
const [selectedCupSize, setSelectedCupSize] = useState(2);

    const [cupSizes, setCupSizes] = useState([]);
  const [sugarLevel, setSugarLevel] = useState(2);
  const [quantity, setQuantity] = useState(1);
  const [useBonus, setUseBonus] = useState(false);
  const [sugarMin, setSugarMin] = useState(0);
  const [sugarMax, setSugarMax] = useState(0);


  useEffect(() => {
    document.title = "Drinks List"; // Määrame lehe tiitli
    // Kontrollime, kas kasutaja on administraator
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);

    const token = localStorage.getItem("token"); // Kasutaja autentimise token
    const isLogged = !!token; // Kontrollime, kas kasutaja on sisse logitud


    axios
      .get('https://localhost:7198/api/Drinks/GetSugarScale')
      .then((response) => {
        if (response.data) {
          setSugarMin(response.data.min);
          setSugarMax(response.data.max);
        }
      })
      .catch((error) => {
        console.error('Ошибка при загрузке данных: ', error);
      });
    axios

      .get('https://localhost:7198/api/Drinks/GetCupSizes')
      .then((response) => {
        setCupSizes(response.data);
      });



    axios
      .get(`https://localhost:7198/api/Drinks`, {
        params: {
          isLogged: isLogged,
          isAdmin: adminStatus
        },
      })
      .then((response) => setDrinks(response.data)) // Kui päring õnnestub, salvestame joogid
      .catch((error) => console.error("Error fetching drinks:", error)); // Kui päring ebaõnnestub, logime vea
  }, []);
    const handleCustomizeDrink = (id) => {
        setPaymentStatus(null);
        setcustomizingDrinkId(id);
        setcustomizingDrink(true);
        setIsModalOpen(true);
    };
  // Funktsioon joogi ettevalmistamiseks (näiteks kui kasutaja ei ole administraator)
  const handlePrepareDrink = async(id)  => {

      setcustomizingDrink(false);
      setcustomizingDrinkId(null);

     let paymentWindowInstance = null;
     let intervalInstance = null;
     let userId = localStorage.getItem("userId");
      if (!userId) {
       const response = await fetch(`https://localhost:7198/api/users/guest-id`);
       const data = await response.json();
        userId = data.Id;
      }
      const orderData = {
      userId: userId,
      sugarLevel: sugarLevel,
      quantity: quantity,
      cupSizeId: selectedCupSize,
      drinkId: id,
      useBalance: useBonus,
     };
      let isLoggedIn = false;
      const token = localStorage.getItem("token");
      if (token) {
        isLoggedIn = true;
      }

     const response = await fetch(`https://localhost:7198/api/orders?isLoggedIn=${isLoggedIn}` ,{
         method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Order initiation failed');

     const data = await response.json();
      const link = data.paymentLink;
      const orderId = await data.orderId;
      setProcessingOrderId(orderId);

      paymentWindowInstance = window.open(link, '_blank');
      setPaymentWindow(paymentWindowInstance); // Save the payment window to state
      setIsModalOpen(true);
      setIsPaymentProcessing(true);

      intervalInstance = setInterval(async () => {
        try {
          const statusResponse = await fetch(link);
          const status = await statusResponse.json();

          if (status.state === 'completed') {
               const confirmData = {
               success: true,
               paymentStatus: "Completed",
             };
            const confirmResponse =  await fetch(`https://localhost:7198/api/orders/confirm/${orderId}` , {
                 method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(confirmData),
            });
            if (confirmResponse.ok){
               clearInterval(intervalInstance);
              paymentWindowInstance?.close();
              setIsPaymentProcessing(false);
              setPaymentStatus('success');

               setTimeout(() => {
                  setIsModalOpen(false);
                  setPaymentStatus('');
                }, 1000);

              setIntervalId(intervalInstance); // Save the interval to state

              setIsProcessing(true); // Määrame töötlemisoleku True
              setSelectedDrinkId(id); // Määrame valitud joogi ID
             await updateBonusBalance(localStorage.getItem('userId'));

              // Kui töötlemine on lõpetatud (5 sekundi pärast), näitame alerti
              setTimeout(() => {
                setIsProcessing(false); // Määrame töötlemisoleku False
                setSelectedDrinkId(null); // Tühjendame valitud joogi ID
                alert("Your drink is ready. You can take it!");
                    window.location.reload();
// Näitame sõnumi
              }, 5000);
            }
            else{
              console.log("Error confirming order.")
               clearInterval(intervalInstance);
              paymentWindowInstance?.close();
              setIsPaymentProcessing(false);
              setPaymentStatus('failed');
            }
            setProcessingOrderId(null);



          }
          else if (status.state === 'failed') {
              setProcessingOrderId(null);
              const confirmData = {
               success: false,
               paymentStatus: "Canceled",
             };
            await fetch(`https://localhost:7198/api/orders/confirm/${orderId}` , {
                 method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(confirmData),
            });
            clearInterval(intervalInstance);
            paymentWindowInstance?.close();
            setIsPaymentProcessing(false);
            setPaymentStatus('failed');
            setTimeout(() => {
              setIsModalOpen(false);
              setPaymentStatus('');
            }, 2000);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      }, 3000);


  };
   const handleCancelPayment = async() => {
       const confirmData = {
               success: false,
               paymentStatus: "Canceled",
             };
            await fetch(`https://localhost:7198/api/orders/confirm/${processingOrderId}` , {
                 method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(confirmData),
            });
    setProcessingOrderId(null);

    if (paymentWindow) paymentWindow.close();
    if (intervalId) clearInterval(intervalId);
    setIsPaymentProcessing(false);
    setPaymentStatus('failed');
    setIsModalOpen(false);

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
  const updateBonusBalance = async (userId) =>{
       try {
        const response = await fetch(`https://localhost:7198/api/users/balance/${userId}`);

        if (!response.ok) {
            throw new Error('User not found or error with request');
        }
        const data = await response.json();
        localStorage.removeItem("bonusBalance");
        localStorage.setItem('bonusBalance',  data.balance)

    } catch (error) {
        console.error('Error fetching balance:', error);
    }
    };
  const handleCupSizeChange = (event) => {
  setSelectedCupSize(event.target.value);
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
                image={drink.imageUrl}
                alt={drink.name}
                sx={{
                 height: 320, // Устанавливаем фиксированную высоту
    width: "100%", // Устанавливаем ширину на 100% от контейнера
    objectFit: "cover", // Изображение будет масштабироваться, обрез
                }}
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
                    onClick={() => handleCustomizeDrink(drink.id)} // Kutsume ettevalmistamise funktsiooni
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
      {isModalOpen && (
        <Modal>
          <ModalContent>
          {customizingDrink && (
              <>
              <Typography variant="h6">Customize Your Drink</Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Choose Cup Size:
            </Typography>
           <RadioGroup
              value={selectedCupSize}  // Используйте selectedCupSize, чтобы отслеживать выбранный размер чашки
              onChange={handleCupSizeChange}
              row
            >
              <FormControl component="fieldset">
                <RadioGroup aria-label="cup size" name="cup-size-group" value={selectedCupSize} onChange={handleCupSizeChange}>
                  {cupSizes.map((cup) => (
                    <FormControlLabel
                      key={cup.id}
                      value={cup.id}  // Используем cup.id как значение для Radio
                      control={<Radio />}
                      label={cup.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>

            </RadioGroup>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Sugar Level:
            </Typography>
            <Slider
              value={sugarLevel}
              onChange={(e, value) => setSugarLevel(value)}
              step={1}
              min={sugarMin}
              max={sugarMax}
              marks
              valueLabelDisplay="auto"
            />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Quantity:
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</Button>
              <TextField
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                inputProps={{ min: 1, type: "number" }}
                sx={{ width: "60px", mx: 2 }}
              />
              <Button onClick={() => setQuantity(quantity + 1)}>+</Button>
            </Box>
           {localStorage.getItem("token") && (
          <FormControlLabel
            control={
              <Checkbox checked={useBonus} onChange={(e) => setUseBonus(e.target.checked)} />
            }
            label={`Use Bonus Balance - €${localStorage.getItem("bonusBalance")}`}
            sx={{ mt: 2 }}
          />
        )}
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={() => handlePrepareDrink(customizingDrinkId)}>
              Pay and Confirm
            </Button>
            </Box>
              </>
            )}
            {isPaymentProcessing ? (
              <>
                <p>Processing payment...</p>
                <CancelButton onClick={handleCancelPayment}>Cancel payment</CancelButton>
              </>
            ) : paymentStatus === 'success' ? (
              <>
            <p>Payment successful!</p>
              </>
            ) : paymentStatus === 'failed' &&  !customizingDrink &&(
              <p>Payment canceled.</p>
            )}
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default DrinksList;