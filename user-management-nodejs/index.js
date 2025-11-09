

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { Eureka } = require('eureka-js-client');


const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`User management service running on port ${PORT}`);
});


// ----------------- Eureka -----------------
const client = new Eureka({
  instance: {
    app: 'user-management-nodejs', // Nom du service dans Eureka
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    port: { '$': PORT, '@enabled': 'true' },
    vipAddress: 'user-management-nodejs',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost', // Adresse du Eureka Server
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

client.start(error => console.log(error || 'User service enregistré dans Eureka'));
