const API_URL = 'http://localhost:3000';

export const api = {
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/user`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to get current user');
    }
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    return response.json();
  },

  loginWithGithub: () => {
    window.location.href = `${API_URL}/auth/github`;
  },

  getSettings: async () => {
    const response = await fetch(`${API_URL}/settings`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to get settings');
    }
    return response.json();
  },

  updateSettings: async (settings: any) => {
    const response = await fetch(`${API_URL}/settings`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    return response.json();
  },
};
