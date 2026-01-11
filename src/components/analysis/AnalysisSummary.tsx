import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Flame, CheckCircle2, ShieldCheck } from "lucide-react";

interface AnalysisSummaryProps {
    summary: string;
    brutalHonestTake?: string;
    credibilityScore?: number;
    keyPoints?: string[];
}

export function AnalysisSummary({ summary, brutalHonestTake, credibilityScore, keyPoints }: AnalysisSummaryProps) {

    const getCredibilityColor = (score: number) => {
        if (score >= 8) return "bg-green-500";
        if (score >= 5) return "bg-yellow-500";
        return "bg-red-500";
    };

    const getCredibilityLabel = (score: number) => {
        if (score >= 8) return "High Credibility";
        if (score >= 5) return "Moderate Credibility";
        return "Low Credibility / Speculative";
    };

    return (
        <div className="space-y-6">

            {/* Credibility Score Section */}
            {credibilityScore !== undefined && (
                <div className="flex items-center justify-between gap-4 rounded-lg border p-4 bg-muted/30">
                    <div className="space-y-1">
                        <h4 className="text-sm font-medium leading-none flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Source Credibility
                        </h4>
                        <p className="text-xs text-muted-foreground">
                            Based on the diversity and authority of sources found.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 min-w-[200px]">
                        <div className="flex flex-col items-end gap-1 w-full">
                            <span className="text-sm font-bold">{credibilityScore}/10</span>
                            <Progress value={credibilityScore * 10} className={`h-2 ${getCredibilityColor(credibilityScore)}`} />
                            <span className="text-[10px] text-muted-foreground">{getCredibilityLabel(credibilityScore)}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Brutal Honest Take */}
            {brutalHonestTake && (
                <Alert className="border-orange-500/50 bg-orange-500/10 text-orange-700 dark:text-orange-400">
                    <Flame className="h-4 w-4" />
                    <AlertTitle>The Brutal Honest Take</AlertTitle>
                    <AlertDescription className="mt-2 text-sm italic">
                        "{brutalHonestTake}"
                    </AlertDescription>
                </Alert>
            )}

            {/* Key Points */}
            {keyPoints && keyPoints.length > 0 && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base">Key Takeaways</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* Standard Summary */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Neutral Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {summary}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
