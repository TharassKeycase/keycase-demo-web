import { useState } from "react";

// Custom error class to provide more context
export class ApiError extends Error {
  public status: number;
  public statusText: string;
  public data: any;

  constructor(status: number, statusText: string, message: string, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("Content-Type");
  let data;

  // Attempt to parse as JSON only if a body exists
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

  // Create detailed error messages based on status codes
  if (!response.ok) {
    let errorMessage = '';
    
    switch (response.status) {
      case 400:
        errorMessage = data?.error || data?.message || 'Bad Request: Invalid data or parameters provided';
        break;
      case 401:
        errorMessage = data?.error || data?.message || 'Unauthorized: Please log in to continue';
        break;
      case 403:
        errorMessage = data?.error || data?.message || 'Forbidden: You do not have permission to perform this action';
        break;
      case 405:
        errorMessage = data?.error || data?.message || 'Method Not Allowed: The requested method is not allowed for this resource';
        break;
      case 404:
        errorMessage = data?.error || data?.message || 'Not Found: The requested resource was not found';
        break;
      case 409:
        errorMessage = data?.error || data?.message || 'Conflict: This resource already exists or conflicts with existing data';
        break;
      case 422:
        errorMessage = data?.error || data?.message || 'Validation Error: Please check your input data';
        break;
      case 429:
        errorMessage = data?.error || data?.message || 'Too Many Requests: Please wait before trying again';
        break;
      case 500:
        errorMessage = data?.error || data?.message || 'Internal Server Error: Something went wrong on our end';
        break;
      case 502:
        errorMessage = data?.error || data?.message || 'Bad Gateway: Service temporarily unavailable';
        break;
      case 503:
        errorMessage = data?.error || data?.message || 'Service Unavailable: Please try again later';
        break;
      case 504:
        errorMessage = data?.error || data?.message || 'Gateway Timeout: Request took too long to process';
        break;
      default:
        if (response.status >= 400 && response.status < 500) {
          errorMessage = data?.error || data?.message || `Client Error (${response.status}): ${response.statusText}`;
        } else if (response.status >= 500) {
          errorMessage = data?.error || data?.message || `Server Error (${response.status}): ${response.statusText}`;
        } else {
          errorMessage = data?.error || data?.message || `HTTP Error (${response.status}): ${response.statusText}`;
        }
    }

    throw new ApiError(
      response.status,
      response.statusText,
      errorMessage,
      data
    );
  }

  // For successful responses, return the status and data
  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};

interface fetchInterface {
  ok: boolean;
  status: number;
  data: any;
}

interface UseFetchReturn {
  error: ApiError | Error | null;
  loading: boolean;
  fetchData: (url: RequestInfo | URL, options: RequestInit) => Promise<fetchInterface>;
  clearError: () => void;
}

const useFetch = (): UseFetchReturn => {
  const [error, setError] = useState<ApiError | Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const clearError = () => {
    setError(null);
  };

  const fetchData = async (
    url: RequestInfo | URL,
    options: RequestInit = {}
  ): Promise<fetchInterface> => {
    setError(null);
    setLoading(true);
    
    try {
      // Always include credentials to send session cookies
      const enhancedOptions: RequestInit = {
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };

      const response: Response = await fetch(url, enhancedOptions);
      const responseData: fetchInterface = await handleResponse(response);
      setLoading(false);
      return responseData;
    } catch (error) {
      setLoading(false);
      
      // Enhanced error handling
      if (error instanceof ApiError) {
        setError(error);
        console.error(`API Error ${error.status}:`, error.message, error.data);
      } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        // Network error
        const networkError = new ApiError(
          0, 
          'Network Error', 
          'Unable to connect to the server. Please check your internet connection and try again.',
          null
        );
        setError(networkError);
        console.error('Network Error:', error);
      } else if (error instanceof Error) {
        setError(error);
        console.error('Fetch Error:', error.message);
      } else {
        // Unknown error
        const unknownError = new Error('An unknown error occurred');
        setError(unknownError);
        console.error('Unknown Error:', error);
      }
      
      throw error;
    }
  };

  return { error, loading, fetchData, clearError };
};

// Helper function to get user-friendly error message
export const getErrorMessage = (error: ApiError | Error | null): string | null => {
  if (!error) return null;
  
  if (error instanceof ApiError) {
    return error.message;
  }
  
  return error.message || 'An unexpected error occurred';
};

// Helper function to check if error is of specific type
export const isApiError = (error: ApiError | Error | null, status?: number): boolean => {
  if (!error || !(error instanceof ApiError)) return false;
  
  if (status !== undefined) {
    return error.status === status;
  }
  
  return true;
};

// Helper function to check for specific error types
export const isUnauthorizedError = (error: ApiError | Error | null): boolean => {
  return isApiError(error, 401);
};

export const isForbiddenError = (error: ApiError | Error | null): boolean => {
  return isApiError(error, 403);
};

export const isNotFoundError = (error: ApiError | Error | null): boolean => {
  return isApiError(error, 404);
};

export const isValidationError = (error: ApiError | Error | null): boolean => {
  return isApiError(error, 400) || isApiError(error, 422);
};

export const isServerError = (error: ApiError | Error | null): boolean => {
  return error instanceof ApiError && error.status >= 500;
};

export default useFetch;
