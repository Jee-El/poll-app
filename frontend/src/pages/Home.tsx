import { format, parseISO } from "date-fns";

import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
    PlusCircle,
    Users,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import type { Choice, Poll } from "@/lib/types";
import { fetchPolls } from "@/lib/api";
import { formatDeadlineDate } from "@/lib/utils";

export default function Home() {
    const [polls, setPolls] = useState<Poll[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { isAuthenticated, user } = useAuth();
    useEffect(() => {
        const getPolls = async () => {
            try {
                const data = await fetchPolls();
                setPolls(data);
            } catch (error) {
                console.error("Error fetching poll:", error);
            } finally {
                setIsLoading(false);
            }
        };

        getPolls();
    }, []);

    const userPolls = [];

    const otherPolls = [];

    for (let i = 0; i < polls.length; i++) {
        if (polls[i].user === user?.username) {
            userPolls.push(polls[i]);
        } else {
            otherPolls.push(polls[i]);
        }
    }

    const PollCard = ({ poll }: { poll: Poll }) => (
        <Link to={`/polls/${poll.id}`}>
            <div
                className={`group p-6 rounded-xl border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${
                    poll.isActive
                        ? "hover:border-primary/20"
                        : "opacity-75 border-red-200"
                }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {poll.user?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {poll.user}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(
                                    parseISO(poll.createdAt),
                                    "yyyy-MM-dd HH:mm"
                                )}
                            </p>
                        </div>
                    </div>
                    <Badge
                        variant={poll.isActive ? "default" : "secondary"}
                        className="shrink-0"
                    >
                        {poll.isActive ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                            <XCircle className="w-3 h-3 mr-1" />
                        )}
                        {poll.isActive ? "Active" : "Expired"}
                    </Badge>
                </div>

                <div className="mb-4">
                    <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors mb-2">
                        {poll.question}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                        {poll.description}
                    </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />

                        <span>
                            {poll.choiceSet.reduce(
                                (sum, current: Choice) => {
                                    return sum + (current.voteCount || 0);
                                },
                                0
                            )}{" "}
                            votes
                        </span>
                    </div>
                    <div
                        className={`flex items-center gap-1 ${
                            poll.isActive
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        <Clock className="h-4 w-4" />
                        <span>
                            {formatDeadlineDate(poll.deadline, {
                                showSimpleExpiredLabel: true,
                            })}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="self-start container mx-auto py-8 px-4 max-w-6xl">
            {polls.length === 0 && (
                <div className="text-center py-16 mb-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <PlusCircle className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                        Create Your First Poll
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        Start engaging with your audience by creating your
                        first poll and gathering valuable insights.
                    </p>
                    <Link to="/create">
                        <Button size="lg">
                            <PlusCircle className="mr-2 h-5 w-5" />
                            Create Poll
                        </Button>
                    </Link>
                </div>
            )}

            {isAuthenticated && userPolls.length > 0 && (
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Your Polls</h2>
                        <Link to="/create">
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Poll
                            </Button>
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {userPolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))}
                    </div>
                </div>
            )}

            {otherPolls.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-6">
                        Discover More Polls
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {otherPolls.map((poll) => (
                            <PollCard key={poll.id} poll={poll} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
