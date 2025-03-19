'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const Label = React.forwardRef(({
                                    className,
                                    htmlFor,
                                    children,
                                    ...props
                                }, ref) => {
    return (
        <label
            ref={ref}
            htmlFor={htmlFor}
            className={cn(
                "text-sm font-medium text-gray-700 block",
                className
            )}
            {...props}
        >
            {children}
        </label>
    );
});

Label.displayName = "Label";

export { Label };