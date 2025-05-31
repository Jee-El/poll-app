import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { fetchPoll, votePoll } from "../lib/api";
import type { Poll } from "../lib/types";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
    BarChart,
    Clock,
    ArrowLeft,
    Users,
    CheckCircle,
    XCircle,
    LogIn,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { formatDeadlineDate } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

export default function PollDetail() {
    const { isAuthenticated } = useAuth();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [poll, setPoll] = useState<Poll | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedChoice, setSelectedChoice] = useState<string | null>(
        null
    );
    const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [hasVoted, setHasVoted] = useState<boolean>(false);

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

    const handleMultipleChoiceChange = (
        choiceId: string,
        checked: boolean
    ) => {
        if (checked) {
            setSelectedChoices((prev) => [...prev, choiceId]);
        } else {
            setSelectedChoices((prev) =>
                prev.filter((id) => id !== choiceId)
            );
        }
    };

    const handleVote = async () => {
        if (!id || !poll || hasVoted) return;

        const isMultipleChoice = poll.allowsMultipleChoices || false;
        const hasValidSelection = isMultipleChoice
            ? selectedChoices.length > 0
            : selectedChoice !== null;

        if (!hasValidSelection) return;

        setSubmitting(true);
        setError(null);

        try {
            let choiceIds: string[];

            if (isMultipleChoice) {
                choiceIds = selectedChoices.map((choice) =>
                    choice.replace("choice-", "")
                );
            } else {
                choiceIds = [selectedChoice!.replace("choice-", "")];
            }

            const updatedPoll = await votePoll(id, choiceIds);

            setPoll(updatedPoll);
            setHasVoted(true);
            navigate(`/polls/${id}/results`);
        } catch (error) {
            console.error("Error submitting vote:", error);
            setError("Failed to submit your vote. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const getTotalVotes = (): number => {
        return (
            poll?.choiceSet.reduce(
                (sum, choice) => sum + (choice.voteCount || 0),
                0
            ) || 0
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error && !poll) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-destructive">
                    {error}
                </h2>
                <Link to="/" className="mt-4 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Polls
                    </Button>
                </Link>
            </div>
        );
    }

    if (!poll) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-medium text-destructive">
                    Poll not found
                </h2>
                <Link to="/" className="mt-4 inline-block">
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Polls
                    </Button>
                </Link>
            </div>
        );
    }

    const canVote =
        isAuthenticated && !hasVoted && poll.isActive !== false;
    const isMultipleChoice = poll.allowsMultipleChoices || false;
    const hasValidSelection = isMultipleChoice
        ? selectedChoices.length > 0
        : selectedChoice !== null;

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Polls
                </Link>
            </div>

            <div
                className={`group p-6 rounded-xl border bg-card shadow-lg ${
                    poll.isActive !== false
                        ? "border-primary/20"
                        : "opacity-90 border-red-200"
                }`}
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {poll.user?.charAt(0)?.toUpperCase() || "A"}
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {poll.user || "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(
                                    parseISO(poll.createdAt),
                                    "yyyy-MM-dd HH:mm"
                                )}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isMultipleChoice && (
                            <Badge variant="outline" className="shrink-0">
                                Multiple Choice
                            </Badge>
                        )}
                        <Badge
                            variant={
                                poll.isActive !== false
                                    ? "default"
                                    : "secondary"
                            }
                            className="shrink-0"
                        >
                            {poll.isActive !== false ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                                <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {poll.isActive !== false
                                ? "Active"
                                : "Expired"}
                        </Badge>
                    </div>
                </div>

                <div className="mb-6">
                    <h1 className="font-semibold text-2xl leading-tight mb-2">
                        {poll.question}
                    </h1>
                    {poll.description && (
                        <p className="text-muted-foreground text-sm mb-4">
                            {poll.description}
                        </p>
                    )}
                    {isMultipleChoice && canVote && (
                        <p className="text-sm text-muted-foreground mb-4">
                            You can select multiple options for this poll.
                        </p>
                    )}
                    {!isAuthenticated && poll.isActive !== false && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-700 font-medium flex items-center">
                                <Link to="/login">
                                    <LogIn className="w-4 h-4 mr-2" />
                                </Link>
                                You must be logged in to vote in this poll
                            </div>
                        </div>
                    )}
                    {hasVoted && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="text-sm text-green-700 font-medium flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                You have already voted in this poll
                            </div>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    {isMultipleChoice ? (
                        <div className="space-y-3">
                            {poll.choiceSet.map((choice) => (
                                <div
                                    key={choice.id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                        canVote
                                            ? "hover:bg-muted/50 border-border"
                                            : "bg-muted/30 border-muted cursor-not-allowed"
                                    }`}
                                >
                                    <Checkbox
                                        id={`choice-${choice.id}`}
                                        checked={selectedChoices.includes(
                                            `choice-${choice.id}`
                                        )}
                                        onCheckedChange={(checked) =>
                                            canVote &&
                                            handleMultipleChoiceChange(
                                                `choice-${choice.id}`,
                                                !!checked
                                            )
                                        }
                                        disabled={!canVote}
                                    />
                                    <Label
                                        htmlFor={`choice-${choice.id}`}
                                        className={`flex-grow ${
                                            canVote
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-75"
                                        }`}
                                    >
                                        <div className="w-full flex items-center justify-between">
                                            <p>{choice.choiceTxt}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {choice.voteCount || 0}{" "}
                                                votes
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <RadioGroup
                            value={selectedChoice || ""}
                            onValueChange={
                                canVote ? setSelectedChoice : undefined
                            }
                            disabled={!canVote}
                            className="space-y-3"
                        >
                            {poll.choiceSet.map((choice) => (
                                <div
                                    key={choice.id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                                        canVote
                                            ? "hover:bg-muted/50 border-border"
                                            : "bg-muted/30 border-muted cursor-not-allowed"
                                    }`}
                                >
                                    <RadioGroupItem
                                        value={`choice-${choice.id}`}
                                        id={`choice-${choice.id}`}
                                        disabled={!canVote}
                                    />
                                    <Label
                                        htmlFor={`choice-${choice.id}`}
                                        className={`flex-grow ${
                                            canVote
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed opacity-75"
                                        }`}
                                    >
                                        <div className="w-full flex items-center justify-between">
                                            <p>{choice.choiceTxt}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {choice.voteCount || 0}{" "}
                                                votes
                                            </p>
                                        </div>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                </div>

                <div className="mb-6">
                    <Button
                        onClick={handleVote}
                        disabled={
                            !hasValidSelection || submitting || !canVote
                        }
                        className="w-full"
                        size="lg"
                    >
                        {submitting
                            ? "Submitting..."
                            : hasVoted
                            ? "Already Voted"
                            : !isAuthenticated
                            ? "Login Required"
                            : poll.isActive === false
                            ? "Poll Expired"
                            : `Submit Vote${
                                  isMultipleChoice &&
                                  selectedChoices.length > 1
                                      ? "s"
                                      : ""
                              }`}
                    </Button>
                    {!canVote && !hasVoted && poll.isActive === false && (
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            This poll is no longer accepting votes.
                        </p>
                    )}
                    {canVote &&
                        isMultipleChoice &&
                        selectedChoices.length > 0 && (
                            <p className="text-sm text-muted-foreground text-center mt-2">
                                {selectedChoices.length} option
                                {selectedChoices.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                selected
                            </p>
                        )}
                </div>

                <div className="flex items-center justify-between text-sm border-t pt-4">
                    <div className="flex items-center gap-1 text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{getTotalVotes()} votes</span>
                    </div>
                    <div
                        className={`flex items-center gap-1 ${
                            poll.isActive !== false
                                ? "text-green-600"
                                : "text-red-600"
                        }`}
                    >
                        <Clock className="h-4 w-4" />
                        <span>
                            {formatDeadlineDate(poll.deadline, {
                                showSimpleExpiredLabel: false,
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-center">
                <Link
                    to={`/polls/${id}/results`}
                    className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center"
                >
                    <BarChart className="mr-1 h-4 w-4" />
                    View current results
                </Link>
            </div>
        </div>
    );
}
