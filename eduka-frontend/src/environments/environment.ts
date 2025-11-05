export const environment = {
  production: false,
  apiUrl: 'http://localhost:8086/api', // Restaurant Management Service
  userApiUrl: 'http://localhost:3000/api', // User Management Service (Node.js)
  services: {
    userManagement: 'http://localhost:3000/api', // User Management Service (Node.js)
    studentEvents: 'http://localhost:8080/api',
    academicDocuments: 'http://localhost:8080/api',
    library: 'http://localhost:8080/api',
    housing: 'http://localhost:8080/api',
    restaurant: 'http://localhost:8086/api', // Restaurant Management Service
    admin: 'http://localhost:8080/api'
  }
};
