import { createContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { getProfile } from "../services/profileService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function syncUser(nextUser) {
    setUser(nextUser);

    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }
  }

  async function refreshUserFromProfile(baseUser = null) {
    try {
      const profile = await getProfile();
      const mergedUser = {
        ...(baseUser || {}),
        ...profile,
      };

      syncUser(mergedUser);
      return mergedUser;
    } catch (error) {
      syncUser(baseUser);
      return baseUser;
    }
  }

  // ===========================
  // Restore Login Saat Refresh
  // ===========================
  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authService.me();
        const userFromSession = response.user || null;
        await refreshUserFromProfile(userFromSession);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  // ===========================
  // Login
  // ===========================
  async function login(credentials) {
    const response = await authService.login(credentials);

    localStorage.setItem("token", response.token);

    const mergedUser = await refreshUserFromProfile(response.user);

    return {
      ...response,
      user: mergedUser,
    };
  }

  // ===========================
  // Logout
  // ===========================
  async function logout() {
    try {
      await authService.logout();
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    syncUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        syncUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
