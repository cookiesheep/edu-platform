'use client';

import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// 按钮样式变体定义
const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                default: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
                destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
                outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
                secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500",
                ghost: "hover:bg-gray-100 hover:text-gray-900 bg-transparent",
                link: "text-blue-600 hover:underline bg-transparent",
            },
            size: {
                default: "h-10 py-2 px-4",
                sm: "h-8 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

// 创建Button组件
const Button = React.forwardRef(({
                                     className,
                                     variant,
                                     size,
                                     children,
                                     onClick,
                                     disabled,
                                     ...props
                                 }, ref) => {
    return (
        <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button, buttonVariants };