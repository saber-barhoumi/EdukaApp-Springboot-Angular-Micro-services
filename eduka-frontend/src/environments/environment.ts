export const environment = {
  production: false,
  apiUrl: '/api', // Use proxy for Restaurant Management Service (port 8083)
  userApiUrl: 'http://localhost:3000/api', // User Management Service (Node.js)
  services: {
    userManagement: 'http://localhost:3000/api', // User Management Service (Node.js)
    studentEvents: 'http://localhost:8080/api',
    academicDocuments: 'http://localhost:8080/api',
    library: 'http://localhost:8080/api',
    housing: 'http://localhost:8080/api',
    restaurant: '/api', // Use proxy for Restaurant Management Service
    admin: 'http://localhost:8080/api'
  }
};
