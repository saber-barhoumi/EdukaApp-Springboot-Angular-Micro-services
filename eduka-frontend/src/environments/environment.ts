export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000', // Node.js User Management Service
  services: {
    userManagement: 'http://localhost:3000/api', // Direct Node.js service
    studentEvents: 'http://localhost:8080/api',
    academicDocuments: 'http://localhost:8080/api',
    library: 'http://localhost:8080/api',
    housing: 'http://localhost:8080/api',
    restaurant: 'http://localhost:8080/api',
    admin: 'http://localhost:8080/api'
  }
};
