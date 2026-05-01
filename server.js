const express = require("express");
const app = express();

const PORT = 3000;

const cars = [
    { name: "BMW X5", price: "95,00,000", image: "https://cdn.bmwblog.com/wp-content/uploads/2023/02/BMW-X5.jpg" },
    { name: "Audi A6", price: "65,00,000", image: "https://cdn.motor1.com/images/mgl/Audi-A6.jpg" },
    { name: "Hyundai Creta", price: "18,00,000", image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/creta-exterior.jpg" },
    { name: "Tata Nexon", price: "12,00,000", image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/129527/nexon-exterior.jpg" }
];

app.get("/cars", (req, res) => {
    res.json(cars);
});

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

app.listen(PORT, () => {
    console.log(`Running on ${PORT}`);
});
