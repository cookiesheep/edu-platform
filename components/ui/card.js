'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

// Card组件 - 卡片容器
const Card = React.forwardRef(({
                                   className,
                                   children,
                                   onClick,
                                   ...props
                               }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border border-gray-200 bg-white shadow-sm",
                onClick ? "cursor-pointer" : "",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
});
Card.displayName = "Card";

// CardHeader组件 - 卡片头部
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

// CardTitle组件 - 卡片标题
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-xl font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

// CardDescription组件 - 卡片描述
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-gray-500", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

// CardContent组件 - 卡片内容
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("p-6 pt-0", className)}
        {...props}
    />
));
CardContent.displayName = "CardContent";

// CardFooter组件 - 卡片底部
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent
};