const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000;

// Start the server
express()
  .use(express.static(path.join(__dirname, 'dist')))
  .set('views', path.join(__dirname, 'dist'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('dist'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))