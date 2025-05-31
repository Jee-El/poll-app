import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";

import type { ChartConfig } from "@/components/ui/chart";

type PollResultsChartProps = {
    data: { name: string; votes: number }[];
};

export function PollResultsChart({ data }: PollResultsChartProps) {
    const chartConfig = {
        votes: {
            label: "Votes",
            color: "hsl(var(--chart-1))",
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Votes per Poll</CardTitle>
                <CardDescription>
                    Poll participation stats
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data} barSize={45}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar
                            dataKey="votes"
                            fill="var(--color-primary)"
                            radius={8}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
