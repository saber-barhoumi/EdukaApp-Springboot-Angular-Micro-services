export const environment = {
  production: true,
  apiUrl: 'https://your-nodejs-user-management-url.com', // Node.js User Management Service (Port 3000)
  userApiUrl: 'https://your-nodejs-user-management-url.com/api', // Node.js User Management
  services: {
    userManagement: 'https://your-nodejs-user-management-url.com/api', // Node.js on port 3000
    studentEvents: 'https://your-api-gateway-url.com/api',
    academicDocuments: 'https://your-api-gateway-url.com/api',
    library: 'https://your-api-gateway-url.com/api',
    housing: 'https://your-api-gateway-url.com/api',
    restaurant: 'https://your-restaurant-service-url.com/api', // Spring Boot on port 8086
    admin: 'https://your-api-gateway-url.com/api'
  }
};
