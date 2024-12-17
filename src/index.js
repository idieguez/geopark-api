const express = require('express');
const app = require('./app');
const PORT = process.env.PORT || 3000;




// Start app.
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
