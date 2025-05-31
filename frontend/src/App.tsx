import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./components/theme-provider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Header from "./components/Header";
import NotFound from "./components/NotFound";

import Home from "./pages/Home";
import PollDetail from "./pages/PollDetail";
import PollResults from "./pages/PollResults";
import CreatePoll from "./pages/CreatePoll";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

import { AuthProvider } from "./contexts/AuthContext";
import Signup from "./pages/Signup";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <BrowserRouter>
                <AuthProvider>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1 flex items-center justify-center pb-16">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/polls/:id"
                                    element={<PollDetail />}
                                />
                                <Route
                                    path="/polls/:id/results"
                                    element={<PollResults />}
                                />
                                <Route
                                    path="/create"
                                    element={
                                        <ProtectedRoute>
                                            <CreatePoll />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/login"
                                    element={<Login />}
                                />
                                <Route
                                    path="signup"
                                    element={<Signup />}
                                />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
