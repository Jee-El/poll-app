import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, LoginFormData, User } from "@/lib/types";
import { axiosPolls } from "@/lib/api";

import { useNavigate } from "react-router";

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const clearAuthState = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    };

    useEffect(() => {
        const checkAuth = async () => {
            const accessToken = localStorage.getItem("accessToken") || "";
            if (!accessToken) {
                setIsLoading(false);
                return;
            }
            try {
                await axiosPolls.post("auth/verify_token/", {
                    token: accessToken,
                });
                setIsAuthenticated(true);
            } catch (error) {
                console.log(
                    "Failed to verify token, attempting to refresh...",
                    error
                );
                try {
                    const refreshToken =
                        localStorage.getItem("refreshToken");
                    const response = await axiosPolls.post(
                        "auth/refresh_token/",
                        { refresh: refreshToken }
                    );
                    const newAccessToken = response.data.access;
                    const newRefreshToken = response.data.refresh;
                    localStorage.setItem("accessToken", newAccessToken);
                    localStorage.setItem(
                        "refreshToken",
                        newRefreshToken
                    );
                    setIsAuthenticated(true);
                } catch (e) {
                    setIsAuthenticated(false);
                    console.error("Failed to refresh token.", e);
                }
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (data: LoginFormData): Promise<void> => {
        const response = await axiosPolls.post("auth/login/", data);
        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const userData = await fetchUser();
        console.log(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
    };

    const fetchUser = async (): Promise<User | null> => {
        const token = localStorage.getItem("accessToken");
        const response = await axiosPolls.get("auth/whoami/", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const logout = async (): Promise<undefined> => {
        const refreshToken: string =
            localStorage.getItem("refreshToken") || "";
        clearAuthState();
        axiosPolls
            .post("auth/logout/", { refresh: refreshToken })
            .catch((e) => {
                console.error("Failed to blacklist refresh token.", e);
            });
        navigate("/", { replace: true });
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};
