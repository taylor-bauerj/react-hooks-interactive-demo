import type {HookType} from "@/App.tsx";
import {cn} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {X} from "lucide-react";
import {ScrollArea} from "@radix-ui/react-scroll-area";

interface SidebarProps {
    selectedHook: HookType;
    onHookSelect: (hook: HookType) => void;
    isOpen: boolean;
    onClose: () => void;
}

interface HookInfo {
    id: HookType;
    name: string;
    description: string;
    category: 'Basic' | 'Advanced' | 'Performance';
}

const hooks: HookInfo[] = [
    {
        id: 'useState',
        name: 'useState',
        description: 'Manage component state',
        category: 'Basic'
    },
    {
        id: 'useEffect',
        name: 'useEffect',
        description: 'Handle side effects',
        category: 'Basic'
    },
    {
        id: 'useContext',
        name: 'useContext',
        description: 'Access React context',
        category: 'Basic'
    },
    {
        id: 'useReducer',
        name: 'useReducer',
        description: 'Complex state management',
        category: 'Advanced'
    },
    {
        id: 'useCallback',
        name: 'useCallback',
        description: 'Memoize callbacks',
        category: 'Performance'
    },
    {
        id: 'useMemo',
        name: 'useMemo',
        description: 'Memoize expensive calculations',
        category: 'Performance'
    },
    {
        id: 'useRef',
        name: 'useRef',
        description: 'Access DOM elements',
        category: 'Advanced'
    },
    {
        id: 'useImperativeHandle',
        name: 'useImperativeHandle',
        description: 'Customize ref exposure',
        category: 'Advanced'
    },
    {
        id: 'useLayoutEffect',
        name: 'useLayoutEffect',
        description: 'Synchronous effects',
        category: 'Advanced'
    },
    {
        id: 'useDebugValue',
        name: 'useDebugValue',
        description: 'Display debug info',
        category: 'Advanced'
    }
];

const getCategoryColor = (category: string) => {
    switch (category) {
        case 'Basic':
            return 'bg-green-100 text-green-800 hover:bg-green-200'
        case 'Advanced':
            return 'bg-blue-100 text-blue-800 hover:bg-blue-200'
        case 'Performance':
            return 'bg-purple-100 text-purple-800 hover:bg-purple-200'
        default:
            return 'bg-gray-100 text-gray-800 hover:bg-gray-200'
    }
};

export default function Sidebar({selectedHook, onHookSelect, isOpen, onClose}: SidebarProps) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed right-0 top-0 h-full w-80 bg-card border-l shadow-lg transform transition-transform duration-300 ease-in-out z-50",
                "lg:relative lg:transform-none lg:shadow-none",
                isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
            )}>
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">React Hooks</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="lg:hidden"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 h-[calc(100vh-80px)]">
                    <div className="p-4 space-y-2">
                        {hooks.map((hook) => (
                            <button
                                key={hook.id}
                                onClick={() => {
                                    onHookSelect(hook.id)
                                    onClose()
                                }}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg border transition-colors",
                                    "hover:bg-accent hover:text-accent-foreground",
                                    selectedHook === hook.id && "bg-accent text-accent-foreground border-primary"
                                )}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <code className="text-sm font-mono font-medium">
                                        {hook.name}
                                    </code>
                                    <div className="flex items-center gap-1">
                                        <Badge
                                            variant="secondary"
                                            className={cn("text-xs", getCategoryColor(hook.category))}
                                        >
                                            {hook.category}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {hook.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </>
    );
}