const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const adminRoutes = require('./routes/admin');
const staffRoutes = require('./routes/staff');
const shiftRoutes = require('./routes/shift');
const attendanceRoutes = require('./routes/attendance');
const slotRoutes = require('./routes/slot');

// app.post('/api/staff/addstaff', (req, res) => {
//   console.log(req.body)
// })

app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/slot', slotRoutes);

app.post('/api/staff/addstaff', (req, res) => {

})
// Connect to MongoDB 
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('MongoDB connected');
//     app.listen(process.env.PORT, () => {
//       console.log(`Server running on port ${process.env.PORT}`);
//     });
//   })
//   .catch(err => console.error('MongoDB connection error:', err));
mongoose.connect('mongodb+srv://chandanuidevops:z7DI17pN4uLmbo6b@cluster0.0dd50i6.mongodb.net/').then(() => {
  console.log('Connection successful!')
})

app.listen(5000, () => {
  console.log('App running')
})