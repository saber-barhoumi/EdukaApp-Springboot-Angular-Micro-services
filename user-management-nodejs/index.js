require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Eureka } = require('eureka-js-client');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// ----------------- Middleware -----------------
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// ----------------- MongoDB -----------------
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// ----------------- Routes -----------------
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// ----------------- Error Handler -----------------
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// ----------------- Démarrage Serveur -----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ User Management Service running on port ${PORT}`);
});

// ----------------- Eureka Registration -----------------
const eurekaClient = new Eureka({
  instance: {
    instanceId: `user-management-nodejs:${PORT}`,
    app: 'user-management-nodejs', // ⚠️ même nom dans Spring Feign
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    statusPageUrl: `http://localhost:${PORT}`,
    port: {
      '$': PORT,
      '@enabled': true,
    },
    vipAddress: 'user-management-nodejs',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/',
  },
});

eurekaClient.logger.level('debug');
eurekaClient.start(error => {
  if (error) {
    console.error('❌ Erreur d’enregistrement Eureka:', error);
  } else {
    console.log('✅ Service Node.js enregistré dans Eureka avec succès !');
  }
});
