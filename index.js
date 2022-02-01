const express = require('express');
const app = express();
 
app.get('/', (req, res) => {
  res
    .status(200)
    .send('<h1>Welcome to Alerts API 😀</h1> <p>put the endpoint for easy use</p>')
    .end();
});
 
// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});