import { format, parseISO } from "date-fns";

import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { useAuth } from "../hooks/useAuth";
import {
    User,
    Mail,
    Calendar,
    BarChart3,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import { formatDeadlineDate } from "@/lib/utils";
import type { UserStats, Poll, Choice } from "@/lib/types";
import { fetchPolls, fetchUserStats } from "@/lib/api";

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [name, setName] = useState<string>(
        user?.firstName + " " + user?.lastName
    );
    const [email, setEmail] = useState<string>(user?.email || "");
    const [userStats, setUserStats] = useState<UserStats>();
    const [userPolls, setUserPolls] = useState<Poll[]>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getUserStats = async () => {
            try {
                const polls: Poll[] = await fetchPolls();
                setUserPolls(polls);
                const stats: UserStats = await fetchUserStats();
                setUserStats(stats);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };
        getUserStats();
    }, []);

    const handleSave = () => {
        // In a real app, this would update the user profile via API
        console.log("Saving profile:", { name, email });
        setIsEditing(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">
                Profile & Settings
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Avatar */}
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-medium">
                                    {user?.username?.charAt(0)}
                                </div>
                            </div>

                            {isEditing ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={name}
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={handleSave}
                                            size="sm"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setIsEditing(false)
                                            }
                                            variant="outline"
                                            size="sm"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            {user?.firstName +
                                                " " +
                                                user?.lastName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span>{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Joined{" "}
                                            {format(
                                                parseISO(
                                                    userStats?.dateJoined
                                                ),
                                                "yyyy-MM-dd"
                                            )}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => setIsEditing(true)}
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                    >
                                        Edit Profile
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Your Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Polls
                                </span>
                                <span className="font-semibold">
                                    {userStats?.totalPolls}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Active Polls
                                </span>
                                <span className="font-semibold text-green-600">
                                    {userStats?.activePolls}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Expired Polls
                                </span>
                                <span className="font-semibold text-red-600">
                                    {userStats?.expiredPolls}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Total Votes Received
                                </span>
                                <span className="font-semibold">
                                    {userStats?.totalVotes}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Recent Polls</CardTitle>
                            <CardDescription>
                                Manage and track your poll performance
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userPolls?.map((poll) => (
                                    <div
                                        key={poll.id}
                                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="font-semibold line-clamp-1 flex-1">
                                                {poll.question}
                                            </h3>
                                            <Badge
                                                variant={
                                                    poll.isActive
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className="ml-2"
                                            >
                                                {poll.isActive ? (
                                                    <CheckCircle className="w-3 h-3 mr-1" />
                                                ) : (
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                )}
                                                {poll.isActive
                                                    ? "Active"
                                                    : "Expired"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                                            <span>
                                                Created{" "}
                                                {format(
                                                    parseISO(
                                                        poll.createdAt
                                                    ),
                                                    "dd-MM-yyyy"
                                                )}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="h-4 w-4" />
                                                {poll.choiceSet.reduce(
                                                    (
                                                        sum,
                                                        current: Choice
                                                    ) => {
                                                        return (
                                                            sum +
                                                            (current.voteCount ||
                                                                0)
                                                        );
                                                    },
                                                    0
                                                )}{" "}
                                                Votes
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`flex items-center gap-1 text-sm ${
                                                    poll.status ===
                                                    "expired"
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                <Clock className="h-4 w-4" />
                                                {formatDeadlineDate(
                                                    poll.deadline,
                                                    {
                                                        showSimpleExpiredLabel:
                                                            true,
                                                    }
                                                )}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link
                                                    to={`/polls/${poll.id}`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                <Link
                                                    to={`/polls/${poll.id}/results`}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        Results
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
