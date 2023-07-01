const express = require("express");
const cors = require("cors");
const port = 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/videos', (req, res) => {
    res.json({ message: `Hello from the server!` });
});

app.listen(port, () => {
    console.log(`app running on port ${port}`);
})