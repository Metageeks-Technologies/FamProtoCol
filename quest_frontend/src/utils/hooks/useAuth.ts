import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

// Define return type of the custom hook
type AuthStatus = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
};

const useAuthStatus = (): AuthStatus => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth instance

    // Listen to the auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
        setUser(user); // Save the user object
      } else {
        setIsAuthenticated(false); // No user is logged in
        setUser(null); // Reset the user object
      }
      setLoading(false); // Done checking the authentication state
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { isAuthenticated, loading, user };
};

export default useAuthStatus;
