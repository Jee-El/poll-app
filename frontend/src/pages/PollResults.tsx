import { format, parseISO } from "date-fns";
import { Link, useParams } from "react-router";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import {
    ArrowLeft,
    Home,
    Share2,
    Clock,
    User,
    BarChart3,
} from "lucide-react";
import { PollResultsChart } from "../components/PollResultsChart";
import { fetchPoll } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Poll, Choice } from "@/lib/types";

export default function PollResultsPage() {
    const { id } = useParams<{ id: string }>();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getPoll = async () => {
            if (!id) return;

            try {
                const data = await fetchPoll(id);
                if (!data) {
                    setError("Poll not found");
                } else {
                    setPoll(data);
                }
            } catch (error) {
                console.error("Error fetching poll:", error);
                setError("Failed to load poll");
            } finally {
                setIsLoading(false);
            }
        };

        getPoll();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: poll?.question || "Poll Results",
                    text: `Check out the results for: ${poll?.question}`,
                    url: window.location.href,
                });
                toast.success("Poll shared successfully!");
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.name !== "AbortError"
                ) {
                    copyToClipboard();
                }
            }
        } else {
            copyToClipboard();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            toast.error("Failed to copy link to clipboard");
        }
    };

    const formatDate = (dateString: string): string => {
        const date = parseISO(dateString);
        const now = new Date();
        const diffInDays = Math.floor(
            (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffInDays === 0) return "Today";
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays} days ago`;

        return format(date, "MMM d, yyyy");
    };

    const calculateTotalVotes = (): number => {
        return (
            poll?.choiceSet.reduce(
                (sum, choice) => sum + (choice.voteCount || 0),
                0
            ) || 0
        );
    };

    const getWinningChoice = (): Choice | null => {
        if (!poll?.choiceSet.length) return null;
        return poll.choiceSet.reduce((winner, current) =>
            (current.voteCount || 0) > (winner.voteCount || 0)
                ? current
                : winner
        );
    };

    if (isLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-2xl">
                <div className="flex justify-center items-center h-[50vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error || !poll) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-2xl">
                <div className="text-center py-12">
                    <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-destructive mb-4">
                        {error || "Poll not found"}
                    </h2>
                    <div className="flex gap-2 justify-center">
                        <Link to="/">
                            <Button variant="outline">
                                <Home className="mr-2 h-4 w-4" />
                                Back to Home
                            </Button>
                        </Link>
                        <Link to={`/polls/${id}`}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Poll
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const totalVotes = calculateTotalVotes();
    const winningChoice = getWinningChoice();

    return (
        <div className="container mx-auto py-8 px-4 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
                <Link
                    to={`/polls/${id}`}
                    className="inline-flex items-center text-sm hover:underline"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to poll
                </Link>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShare}
                    className="flex items-center gap-2"
                >
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </div>

            <Card>
                <CardHeader>
                    {poll.isActive !== false && (
                        <div className="mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active Poll
                            </span>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                            {poll.user?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <p className="font-medium">
                                    {poll.user || "Anonymous"}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                    Created {formatDate(poll.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CardTitle className="text-2xl mb-2">
                        {poll.question}
                    </CardTitle>

                    {poll.description && (
                        <CardDescription className="mb-4">
                            {poll.description}
                        </CardDescription>
                    )}

                    <CardDescription className="flex items-center gap-4">
                        <span>
                            <BarChart3 className="inline h-4 w-4 mr-1" />
                            {totalVotes}{" "}
                            {totalVotes === 1 ? "vote" : "votes"}
                        </span>
                        {winningChoice && totalVotes > 0 && (
                            <span className="text-green-600 font-medium">
                                Leading: {winningChoice.choiceTxt} (
                                {winningChoice.voteCount} votes)
                            </span>
                        )}
                    </CardDescription>

                    <div className="mt-2 text-sm text-muted-foreground">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Deadline:{" "}
                        {format(
                            parseISO(poll.deadline),
                            "MMM d, yyyy 'at' h:mm a"
                        )}
                    </div>
                </CardHeader>

                <CardContent>
                    {totalVotes > 0 ? (
                        <PollResultsChart
                            data={poll.choiceSet.map(
                                (choice: Choice) => ({
                                    name: choice.choiceTxt,
                                    votes: choice.voteCount || 0,
                                })
                            )}
                        />
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">
                                No votes yet
                            </h3>
                            <p>Be the first to vote on this poll!</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Link
                            to={`/polls/${id}`}
                            className="flex-1 sm:flex-none"
                        >
                            <Button
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                {poll.isActive !== false
                                    ? "Vote"
                                    : "View Poll"}
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleShare}
                            className="flex items-center gap-2"
                        >
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <Link to="/" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {poll.allowsMultipleChoices && (
                <Card className="mt-4">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
                            <span>
                                This poll allows multiple choice
                                selections
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
