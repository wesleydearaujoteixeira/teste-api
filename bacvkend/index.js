const express = require('express');
const app = express();



app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Doe' },
    { id: 3, name: 'Alice Doe' }
  ]);
});


app.listen(3000, () => {
      console.log('Server is running on port 3000');
})