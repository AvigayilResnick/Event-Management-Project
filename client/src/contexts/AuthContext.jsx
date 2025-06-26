import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => {
//     const rawToken = localStorage.getItem("token");
//     console.log("💾 LocalStorage token:", rawToken);
//     return rawToken && rawToken !== "null" && rawToken !== "undefined" ? rawToken : null;
//   });

//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     console.log("💾 State token:", token);
//   }, [token]);

//   useEffect(() => {
//     if (token && token !== "null" && token !== "undefined") {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   useEffect(() => {
//     console.log("📥 useEffect בודק את token:");
//     console.log("📌 token:", token);
//     console.log("📌 user:", user);

//     const isTokenValid = token && token !== "null" && token !== "undefined";

//     if (!isTokenValid || user) {
//       console.warn("⚠️ דילגנו על טעינת המשתמש — תנאים לא מתקיימים");
//       return;
//     }

//     console.log("🟡 Token קיים, מנסה לטעון את המשתמש...");

//     fetch("http://localhost:5000/api/users/myInfoForRefresh", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((res) => {
//         console.log("📬 תגובה מהשרת /api/myinfo:", res);
//         if (!res.ok) throw new Error("Invalid token");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("✅ התקבל מידע משתמש:", data);
//         setUser(data);
//       })
//       .catch((err) => {
//         console.warn("❌ שגיאה בטעינת המשתמש מהטוקן:", err.message);
//         setToken(null);
//         setUser(null);
//       });
//   }, [token, user]);

//   const login = (userData, tokenData) => {
//     console.log("🔁 login called with:", userData, tokenData);
//     setUser(userData);
//     setToken(tokenData);
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//   };

//   return (
//     <AuthContext.Provider value={{ token, user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };