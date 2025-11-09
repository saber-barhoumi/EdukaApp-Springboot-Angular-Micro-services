export const environment = {
  production: false,
  apiUrl: '/api',
  userApiUrl: 'http://localhost:3000/api',
  services: {
    userManagement: 'http://localhost:3000/api',
    studentEvents: 'http://localhost:8080/api',
    academicDocuments: 'http://localhost:8080/api',
    library: 'http://localhost:8080/api',
    housing: 'http://localhost:8080/api',
    restaurant: '/api',
    admin: '/api/v1', // Using proxy for admin management service
    academicPrograms: '/api/v1/academic-programs', // Using proxy for academic programs
    departments: '/api/v1/departments' // Using proxy for departments
  }
};
