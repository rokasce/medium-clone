import {
  createContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";
import keycloak from "./keycloak";

interface User {
  username: string;
  email?: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | undefined;
  user: User | undefined;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

// Track initialization state outside component to survive StrictMode remounts
let isInitialized = false;
let initPromise: Promise<boolean> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const refreshIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Only initialize once, even with StrictMode
    if (!isInitialized && !initPromise) {
      initPromise = keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
      });
      isInitialized = true;
    }

    initPromise!
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setIsLoading(false);

        if (authenticated && !refreshIntervalRef.current) {
          // Set up token refresh
          refreshIntervalRef.current = window.setInterval(() => {
            keycloak.updateToken(70).catch(() => {
              console.log("Failed to refresh token");
            });
          }, 60000);
        }
      })
      .catch((error) => {
        console.error("Keycloak init failed:", error);
        setIsLoading(false);
      });

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, []);

  const login = () => {
    keycloak.login();
  };

  const logout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
  };

  const user: User | undefined = keycloak.tokenParsed
    ? {
        username: keycloak.tokenParsed.preferred_username,
        email: keycloak.tokenParsed.email,
        name: keycloak.tokenParsed.name,
      }
    : undefined;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        token: keycloak.token,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
