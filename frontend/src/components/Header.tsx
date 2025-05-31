"use client";

import { Link, useLocation } from "react-router";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { useAuth } from "../hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, Settings, PlusCircle } from "lucide-react";

export default function Header() {
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const isLoginPage = location.pathname === "/login";
    return (
        <header className="border-b">
            <div className="container mx-auto py-4 px-4 flex items-center justify-between">
                <Link to="/" className="font-bold text-xl">
                    Polls App
                </Link>
                <div className="flex items-center gap-4">
                    <Link to="/create">
                        <Button variant="outline" size="sm">
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Create Poll
                        </Button>
                    </Link>

                    {isAuthenticated && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                                        {user.username.charAt(0)}
                                    </div>
                                    {user.username}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Profile & Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="flex items-center gap-2"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        !isLoginPage && (
                            <Link to="/login">
                                <Button variant="outline">Login</Button>
                            </Link>
                        )
                    )}
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
}
