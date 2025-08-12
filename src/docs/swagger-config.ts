/**
 * Swagger UI Configuration
 * Customize the behavior and appearance of Swagger UI
 */

export const swaggerConfig = {
  // UI Configuration
  docExpansion: 'list' as const, // 'list', 'full', 'none'
  defaultModelsExpandDepth: 1,
  defaultModelExpandDepth: 1,
  displayRequestDuration: true,
  filter: true,
  showExtensions: true,
  showCommonExtensions: true,
  tryItOutEnabled: true,
  
  // Request Interceptors (for adding auth headers automatically)
  requestInterceptor: (request: any) => {
    // Automatically add JWT token from localStorage if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      request.headers['Authorization'] = `Bearer ${token}`;
    }
    return request;
  },
  
  // Response Interceptors (for handling responses)
  responseInterceptor: (response: any) => {
    // Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', response);
    }
    return response;
  },
  
  // Deep linking
  deepLinking: true,
  
  // Display options
  displayOperationId: false,
  defaultModelRendering: 'model' as const,
  
  // Try it out
  supportedSubmitMethods: ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'] as ('get' | 'put' | 'post' | 'delete' | 'options' | 'head' | 'patch' | 'trace')[]
};

export default swaggerConfig;