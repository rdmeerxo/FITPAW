import app from './app.js';

const PORT = process.env.PORT || 3001;

//railway is gonna handle HTTPS, so using plain HTTP
app.listen(PORT, () => {
  console.log(`FitPaw API running on port ${PORT}`);
});
