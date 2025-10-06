"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

interface ExportProgressProps {
  isVisible: boolean;
  progress: number;
  status: "idle" | "processing" | "downloading" | "success" | "error";
  message: string;
}

export function ExportProgress({
  isVisible,
  progress,
  status,
  message,
}: ExportProgressProps) {
  if (!isVisible) return null;

  const getStatusIcon = () => {
    switch (status) {
      case "processing":
      case "downloading":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 animate-in slide-in-from-bottom-4">
      <Card className="p-4 shadow-lg border-2 backdrop-blur-sm bg-white/95 dark:bg-black/95">
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">{message}</p>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-zinc-500 mt-1.5">{progress}% selesai</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
