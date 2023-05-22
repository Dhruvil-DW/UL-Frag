const express = require('express')
const app = express()
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// This displays message that the server running and listening to specified port
const port = process.env.APP_PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.use('/api', routes);
const root = path.join(__dirname, '..', 'client', 'build');
app.use(express.static(root));
app.use((req, res) => {
  res.sendFile('index.html', { root });
});
// app.get('/',function(req,res){
//     res.send('Hello world');
// })

// app.listen(3001, function(){
//     console.log('Example app');
// })
