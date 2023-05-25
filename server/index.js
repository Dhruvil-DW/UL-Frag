const express = require('express')
const cors = require('cors')
const path = require('path');
// require('dotenv').config();
const routes = require('./routes/index.route');

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This displays message that the server running and listening to specified port
const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', routes);
const root = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(root));
app.use('/api', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});
app.use((req, res) => {
  res.sendFile('index.html', { root });
});

