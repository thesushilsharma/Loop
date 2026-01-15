"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface MeterProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showEmoji?: boolean;
  className?: string;
  indicatorClassName?: string;
  labelClassName?: string;
}

const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  (
    {
      value,
      max = 100,
      size = "md",
      showEmoji = true,
      className,
      indicatorClassName,
      labelClassName,
      ...props
    },
    ref,
  ) => {
    // Normalize value between 0 and 1
    const normalizedValue = Math.min(Math.max(value, 0), max) / max;

    // Calculate rotation angle (from -90 to 90 degrees)
    const rotationAngle = -90 + normalizedValue * 180;

    // Determine color based on value
    const _getColor = () => {
      if (normalizedValue < 0.3) return "bg-red-500"; // Red zone
      if (normalizedValue < 0.4) return "bg-orange-500"; // Orange zone
      if (normalizedValue < 0.6) return "bg-yellow-500"; // Yellow zone
      if (normalizedValue < 0.8) return "bg-green-500"; // Green zone
      return "bg-blue-500"; // Blue zone
    };

    // Determine emoji based on value
    const getEmoji = () => {
      if (normalizedValue < 0.3) return "💀"; // Skull for red zone
      if (normalizedValue >= 0.8) return "🔥"; // Fire for blue zone
      return "";
    };

    // Size classes
    const sizeClasses = {
      sm: {
        container: "h-24 w-48",
        gauge: "h-16 w-32",
        indicator: "h-16 w-1",
        emoji: "text-xl",
      },
      md: {
        container: "h-32 w-64",
        gauge: "h-24 w-48",
        indicator: "h-24 w-1.5",
        emoji: "text-2xl",
      },
      lg: {
        container: "h-40 w-80",
        gauge: "h-32 w-64",
        indicator: "h-32 w-2",
        emoji: "text-3xl",
      },
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex flex-col items-center",
          sizeClasses[size].container,
          className,
        )}
        {...props}
      >
        {/* Gauge Background */}
        <div
          className={cn(
            "relative overflow-hidden rounded-t-full bg-gray-200",
            sizeClasses[size].gauge,
          )}
        >
          {/* Red Zone */}
          <div className="absolute bottom-0 left-0 h-full w-[20%] bg-red-500 rounded-tl-full" />
          {/* Orange Zone */}
          <div className="absolute bottom-0 left-[20%] h-full w-[10%] bg-orange-500" />
          {/* Yellow Zone */}
          <div className="absolute bottom-0 left-[30%] h-full w-[20%] bg-yellow-500" />
          {/* Green Zone */}
          <div className="absolute bottom-0 left-[50%] h-full w-[30%] bg-green-500" />
          {/* Blue Zone */}
          <div className="absolute bottom-0 left-[80%] h-full w-[20%] bg-blue-500 rounded-tr-full" />

          {/* Indicator */}
          <div
            className={cn(
              "absolute bottom-0 left-1/2 origin-bottom -translate-x-1/2",
              sizeClasses[size].indicator,
              indicatorClassName,
            )}
            style={{
              transform: `translateX(-50%) rotate(${rotationAngle}deg)`,
              backgroundColor: "#f5f5f5",
              boxShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
            }}
          />

          {/* Indicator Pivot */}
          <div className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-gray-800" />
        </div>

        {/* Labels */}
        <div
          className={cn(
            "mt-2 flex w-full justify-between text-sm",
            labelClassName,
          )}
        >
          <span className="text-red-500 font-medium">Bad</span>
          <span className="text-green-500 font-medium">WOW</span>
        </div>

        {/* Emoji Display */}
        {showEmoji && getEmoji() && (
          <div
            className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
              sizeClasses[size].emoji,
            )}
          >
            {getEmoji()}
          </div>
        )}
      </div>
    );
  },
);

Meter.displayName = "Meter";

export { Meter };
