import { msalInstance } from "../services/msalConfig";
import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { type AccountInfo, type AuthenticationResult } from "@azure/msal-browser";

interface AuthContextType {
    user: AccountInfo | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AccountInfo | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Espera a que la instancia esté lista
                await msalInstance.initialize?.(); // solo si tu versión lo tiene
                const accounts = msalInstance.getAllAccounts();
                if (accounts.length > 0) {
                    setUser(accounts[0]);
                }
            } catch (err) {
                console.error("Error inicializando MSAL:", err);
            }
        };

        init();
    }, []);

    const login = async () => {
        try {
            const response: AuthenticationResult = await msalInstance.loginPopup({
                scopes: ["User.Read"],
            });
            setUser(response.account);
        } catch (err: any) {
            if (err.errorCode === "user_cancelled") {
                console.log("El usuario canceló el login, puede intentar nuevamente.");
            } else {
                console.error("Login failed:", err);
            }
        }
    };


    const logout = () => {
        msalInstance.logoutPopup();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
