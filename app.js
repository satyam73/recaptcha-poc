require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const axios = require('axios');
const path = require('path');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: process.env.FRONTEND_URL}));

// configuration setup for production
// const dirName = path.resolve(__dirname);

// if(process.env.NODE_ENV === "production"){
//   app.use(express.static(path.join(dirName, "./recaptcha-poc/build")));
//   app.get("*", (req,res)=> res.sendFile(path.join(dirName, "./recaptcha-poc/build/index.html")));
// }else{
//   app.get("/", (req, res) => {
//     res.status(200).send({ response: "Api is running successfully!" });
//   });
// }
// configuration setup for production

app.get('/', (req, res) => {
    console.log('running');

    res.status(200).send({
        message: 'ok'
    })
})

app.post('/verify', async (req, res) => {
    const { name, response } = req?.body;

    if (!response || !name) {
        return res.status(400).send({
            message: 'Please fill the required data!',
            status: false
        })
    }
    const { data, status } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${response}`);

    if (!data.success) {
        return res.status(401).send({
            message: 'not verified!',
            status: false
        })
    }

    res.status(200).send({
        message: 'verified',
        status: { name, ...data }
    })
})

app.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`)
})