import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "68d3a24a4126d811e0a0f4fc", 
  requiresAuth: true // Ensure authentication is required for all operations
});
