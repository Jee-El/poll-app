import { format, parseISO } from "date-fns";
import type React from "react";

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { createPoll } from "../lib/api";
import type { Poll } from "@/lib/types";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { calculateDeadline } from "../lib/utils";

interface FormData {
    question: string;
    description: string;
    choices: string[];
    deadlineDuration: number;
    deadlineUnit: "hours" | "days" | "weeks";
    pollType: "single" | "multiple";
}

export default function CreatePoll(): JSX.Element {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        question: "",
        description: "",
        choices: ["", ""],
        deadlineDuration: 12,
        deadlineUnit: "hours",
        pollType: "single",
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePollTypeChange = (value: "single" | "multiple") => {
        setFormData((prev) => ({
            ...prev,
            pollType: value,
        }));
    };

    const handleDurationChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = Number.parseInt(e.target.value) || 0;
        setFormData((prev) => ({
            ...prev,
            deadlineDuration: value,
        }));
    };

    const handleUnitChange = (value: "hours" | "days" | "weeks") => {
        setFormData((prev) => ({
            ...prev,
            deadlineUnit: value,
        }));
    };

    const handleChoiceChange = (index: number, value: string) => {
        const newChoices = [...formData.choices];
        newChoices[index] = value;
        setFormData((prev) => ({
            ...prev,
            choices: newChoices,
        }));
    };

    const addChoice = () => {
        setFormData((prev) => ({
            ...prev,
            choices: [...prev.choices, ""],
        }));
    };

    const removeChoice = (index: number) => {
        if (formData.choices.length <= 2) {
            setError("A poll must have at least 2 choices");
            return;
        }

        const newChoices = formData.choices.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            choices: newChoices,
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.question.trim()) {
            setError("Question is required");
            return;
        }

        if (
            formData.choices.filter((choice) => choice.trim()).length < 2
        ) {
            setError("At least 2 non-empty choices are required");
            return;
        }

        if (formData.deadlineDuration <= 0) {
            setError("Deadline duration must be greater than 0");
            return;
        }

        setSubmitting(true);
        try {
            const validChoices = formData.choices.filter((choice) =>
                choice.trim()
            );

            let poll: Poll = {
                question: formData.question,
                description: formData.description,
                choiceSet: validChoices.map((validChoice) => ({
                    choiceTxt: validChoice,
                })),
                createdAt: new Date().toISOString(),
                deadline: calculateDeadline(
                    formData.deadlineDuration,
                    formData.deadlineUnit
                ).toISOString(),
                allowsMultipleChoices: formData.pollType === "multiple",
            };

            poll = await createPoll(poll);
            navigate(`/polls/${poll.id}`);
        } catch (error) {
            console.error("Error creating poll:", error);
            setError("Failed to create poll");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <div className="mb-6">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Back to Polls
                </Link>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader className="mb-4">
                        <CardTitle>Create New Poll</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="question">Question</Label>
                            <Input
                                id="question"
                                name="question"
                                value={formData.question}
                                onChange={handleChange}
                                placeholder="What do you want to ask?"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Description (Optional)
                            </Label>
                            <Input
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Provide more context about your poll"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <Label>Choices</Label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={addChoice}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            {formData.choices.map((choice, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        value={choice}
                                        onChange={(e) =>
                                            handleChoiceChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Choice ${
                                            index + 1
                                        }`}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            removeChoice(index)
                                        }
                                        className="shrink-0"
                                    >
                                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-row space-y-2 justify-between items-center">
                            <Label>Poll Type</Label>
                            <RadioGroup
                                value={formData.pollType}
                                onValueChange={handlePollTypeChange}
                                className="flex flex-row space-x-2"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="single"
                                        id="single"
                                    />
                                    <Label
                                        htmlFor="single"
                                        className="cursor-pointer"
                                    >
                                        Single Choice
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="multiple"
                                        id="multiple"
                                    />
                                    <Label
                                        htmlFor="multiple"
                                        className="cursor-pointer"
                                    >
                                        Multiple Choice
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="flex flex-row items-center justify-between space-y-2">
                            <Label>Poll Duration</Label>
                            <div className="flex gap-3 items-center">
                                <div>
                                    <Input
                                        id="deadlineDuration"
                                        name="deadlineDuration"
                                        type="number"
                                        min="1"
                                        value={formData.deadlineDuration}
                                        onChange={handleDurationChange}
                                        className="w-auto"
                                    />
                                </div>
                                <div>
                                    <Select
                                        value={formData.deadlineUnit}
                                        onValueChange={(value) =>
                                            handleUnitChange(
                                                value as
                                                    | "hours"
                                                    | "days"
                                                    | "weeks"
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hours">
                                                Hours
                                            </SelectItem>
                                            <SelectItem value="days">
                                                Days
                                            </SelectItem>
                                            <SelectItem value="weeks">
                                                Weeks
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                        Expires on{" "}
                                        {format(
                                            parseISO(
                                                calculateDeadline(
                                                    formData.deadlineDuration,
                                                    formData.deadlineUnit
                                                ).toISOString()
                                            ),
                                            "dd-MM-yyyy 'at' HH:mm"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-6">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Creating Poll..."
                                : "Create Poll"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
