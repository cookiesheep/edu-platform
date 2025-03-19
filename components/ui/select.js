'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// 选择组件的Context
const SelectContext = React.createContext({
    value: undefined,
    onValueChange: () => {},
    open: false,
    setOpen: () => {},
});

// Select主组件
const Select = ({
                    children,
                    value,
                    defaultValue,
                    onValueChange,
                    ...props
                }) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [open, setOpen] = React.useState(false);

    const handleValueChange = React.useCallback((newValue) => {
        setInternalValue(newValue);
        onValueChange?.(newValue);
        setOpen(false);
    }, [onValueChange]);

    const contextValue = React.useMemo(() => ({
        value: value !== undefined ? value : internalValue,
        onValueChange: handleValueChange,
        open,
        setOpen,
    }), [value, internalValue, handleValueChange, open, setOpen]);

    return (
        <SelectContext.Provider value={contextValue}>
            <div className="relative" {...props}>
                {children}
            </div>
        </SelectContext.Provider>
    );
};

// 自定义Hook，用于访问SelectContext
const useSelectContext = () => {
    const context = React.useContext(SelectContext);
    if (!context) {
        throw new Error('Select components must be used within a Select component');
    }
    return context;
};

// 触发器组件
const SelectTrigger = React.forwardRef(({ className, children, id, ...props }, ref) => {
    const { value, setOpen, open } = useSelectContext();

    return (
        <button
            id={id}
            type="button"
            ref={ref}
            onClick={() => setOpen(!open)}
            className={cn(
                "flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                className
            )}
            {...props}
        >
            <span className="flex items-center gap-2">{children}</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

// 选项列表容器
const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const { open } = useSelectContext();

    if (!open) return null;

    return (
        <div
            ref={ref}
            className={cn(
                "absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg",
                className
            )}
            {...props}
        >
            <div className="py-1">
                {children}
            </div>
        </div>
    );
});
SelectContent.displayName = "SelectContent";

// 选项值组件
const SelectValue = React.forwardRef(({ className, placeholder, ...props }, ref) => {
    const { value } = useSelectContext();

    return (
        <span
            ref={ref}
            className={cn("flex truncate", className)}
            {...props}
        >
      {value || placeholder}
    </span>
    );
});
SelectValue.displayName = "SelectValue";

// 选项项目组件
const SelectItem = React.forwardRef(({ className, children, value, ...props }, ref) => {
    const { onValueChange, value: selectedValue } = useSelectContext();
    const isSelected = selectedValue === value;

    return (
        <div
            ref={ref}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm outline-none",
                isSelected ? "bg-blue-50 text-blue-700" : "hover:bg-gray-50",
                className
            )}
            onClick={() => onValueChange(value)}
            {...props}
        >
            {children}
        </div>
    );
});
SelectItem.displayName = "SelectItem";

export {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
};