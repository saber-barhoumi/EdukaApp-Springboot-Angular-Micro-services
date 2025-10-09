export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080', // API Gateway URL
  services: {
    userManagement: 'http://localhost:8080/api', // Routed through API Gateway
    studentEvents: 'http://localhost:8080/api',
    academicDocuments: 'http://localhost:8080/api',
    library: 'http://localhost:8080/api',
    housing: 'http://localhost:8080/api',
    restaurant: 'http://localhost:8080/api',
    admin: 'http://localhost:8080/api'
  }
};
