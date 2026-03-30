
import app from './app.js';

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');


const PORT = process.env.PORT || 3001;

//railway is gonna handle HTTPS, so using plain HTTP
app.listen(PORT, () => {
  console.log(`FitPaw API running on port ${PORT}`);
});
