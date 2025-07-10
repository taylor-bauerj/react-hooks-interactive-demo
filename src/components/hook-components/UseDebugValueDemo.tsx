import { useState, useEffect, useCallback, useMemo, useDebugValue } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Bug,
    Code,
    Timer,
    Globe,
    Zap,
    Database,
    Settings,
    Activity,
    Search,
    User,
    ShoppingCart,
    Bell,
    Wifi
} from 'lucide-react'

// Example 1: Basic useDebugValue with simple state
function useCounter(initialValue = 0) {
    const [count, setCount] = useState(initialValue);

    // Basic debug value
    useDebugValue(count);

    const increment = useCallback(() => setCount(c => c + 1), []);
    const decrement = useCallback(() => setCount(c => c - 1), []);
    const reset = useCallback(() => setCount(initialValue), [initialValue]);

    return { count, increment, decrement, reset };
}

// Example 2: useDebugValue with object state
function useUser(userId: string) {
    const [user, setUser] = useState<{
        id: string;
        name: string;
        email: string;
        status: 'loading' | 'success' | 'error';
    }>({
        id: userId,
        name: '',
        email: '',
        status: 'loading'
    });

    // Debug value with object
    useDebugValue(user, user => `User: ${user.name} (${user.status})`);

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setUser({
                id: userId,
                name: `User ${userId}`,
                email: `user${userId}@example.com`,
                status: 'success'
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [userId]);

    return user;
}

// Example 3: useDebugValue with formatter function
function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Debug value with formatter function for performance
    useDebugValue(
        { key, value: storedValue },
        ({ key, value }) => `localStorage[${key}]: ${JSON.stringify(value).slice(0, 50)}...`
    );

    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setValue] as const;
}

// Example 4: useDebugValue with conditional debugging
function useFetch<T>(url: string, enabled = true) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const state = { data, loading, error, url };

    // Conditional debug value only when there's an error or loading
    useDebugValue(
        state,
        (state) => {
            if (state.error) return `❌ Error: ${state.error}`;
            if (state.loading) return `⏳ Loading: ${state.url}`;
            if (state.data) return `✅ Success: ${state.url}`;
            return `⚪ Idle: ${state.url}`;
        }
    );

    useEffect(() => {
        if (!enabled) return;

        let cancelled = false;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (!cancelled) {
                    // Mock successful response
                    setData({ message: `Data from ${url}`, timestamp: new Date().toISOString() } as T);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'An error occurred');
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [url, enabled]);

    return { data, loading, error };
}

// Example 5: useDebugValue with complex state
function useShoppingCart() {
    const [items, setItems] = useState<Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
    }>>([]);

    const totalItems = useMemo(() =>
            items.reduce((sum, item) => sum + item.quantity, 0),
        [items]
    );

    const totalPrice = useMemo(() =>
            items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        [items]
    );

    // Debug value with complex computed state
    useDebugValue(
        { items, totalItems, totalPrice },
        ({ items, totalItems, totalPrice }) =>
            `Cart: ${items.length} types, ${totalItems} items, $${totalPrice.toFixed(2)}`
    );

    const addItem = useCallback((item: { id: string; name: string; price: number }) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i =>
                    i.id === item.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    }, []);

    const removeItem = useCallback((id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    const clear = useCallback(() => {
        setItems([]);
    }, []);

    return { items, totalItems, totalPrice, addItem, removeItem, clear };
}

// Example 6: useDebugValue with timer
function useTimer(duration: number) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);

    // Debug value with status indicator
    useDebugValue(
        { timeLeft, isRunning, duration },
        ({ timeLeft, isRunning, duration }) => {
            const progress = ((duration - timeLeft) / duration * 100).toFixed(1);
            const status = isRunning ? '▶️' : timeLeft === 0 ? '🏁' : '⏸️';
            return `${status} Timer: ${timeLeft}s (${progress}%)`;
        }
    );

    useEffect(() => {
        if (!isRunning || timeLeft === 0) return;

        const timer = setTimeout(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, isRunning]);

    const start = useCallback(() => setIsRunning(true), []);
    const pause = useCallback(() => setIsRunning(false), []);
    const reset = useCallback(() => {
        setTimeLeft(duration);
        setIsRunning(false);
    }, [duration]);

    return { timeLeft, isRunning, start, pause, reset };
}

// Example 7: useDebugValue with online status
function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [lastChanged, setLastChanged] = useState<Date | null>(null);

    // Debug value with timestamp
    useDebugValue(
        { isOnline, lastChanged },
        ({ isOnline, lastChanged }) => {
            const status = isOnline ? '🟢 Online' : '🔴 Offline';
            const time = lastChanged ? lastChanged.toLocaleTimeString() : 'Never';
            return `${status} (changed: ${time})`;
        }
    );

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setLastChanged(new Date());
        };

        const handleOffline = () => {
            setIsOnline(false);
            setLastChanged(new Date());
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return { isOnline, lastChanged };
}

// Example 8: useDebugValue with search functionality
function useSearch<T>(items: T[], searchTerm: string, searchFn: (item: T, term: string) => boolean) {
    const [isSearching, setIsSearching] = useState(false);

    const results = useMemo(() => {
        if (!searchTerm.trim()) return items;

        setIsSearching(true);
        const filtered = items.filter(item => searchFn(item, searchTerm));

        // Simulate search delay
        setTimeout(() => setIsSearching(false), 100);

        return filtered;
    }, [items, searchTerm, searchFn]);

    // Debug value with search statistics
    useDebugValue(
        { searchTerm, totalItems: items.length, resultCount: results.length, isSearching },
        ({ searchTerm, totalItems, resultCount, isSearching }) => {
            if (isSearching) return '🔍 Searching...';
            if (!searchTerm) return `📋 All items (${totalItems})`;
            return `🔍 "${searchTerm}": ${resultCount}/${totalItems} results`;
        }
    );

    return { results, isSearching };
}

// Components using the custom hooks
const CounterExample = () => {
    const { count, increment, decrement, reset } = useCounter(0);

    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className="text-4xl font-bold mb-4">{count}</div>
                <div className="flex gap-2 justify-center">
                    <Button onClick={decrement} variant="outline">-</Button>
                    <Button onClick={increment}>+</Button>
                    <Button onClick={reset} variant="outline">Reset</Button>
                </div>
            </div>
            <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                    Open React DevTools to see the debug value for this counter hook
                </AlertDescription>
            </Alert>
        </div>
    );
};

const UserExample = () => {
    const [userId, setUserId] = useState('123');
    const user = useUser(userId);

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Enter user ID"
                />
                <Button onClick={() => setUserId(Math.floor(Math.random() * 1000).toString())}>
                    Random ID
                </Button>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {user.status === 'loading' ? (
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 animate-spin" />
                            <span>Loading user...</span>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div><strong>ID:</strong> {user.id}</div>
                            <div><strong>Name:</strong> {user.name}</div>
                            <div><strong>Email:</strong> {user.email}</div>
                            <div><strong>Status:</strong> {user.status}</div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const LocalStorageExample = () => {
    const [name, setName] = useLocalStorage('demo-name', '');
    const [preferences, setPreferences] = useLocalStorage('demo-preferences', {
        theme: 'light',
        notifications: true
    });

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Name (stored in localStorage)</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                />
            </div>

            <div className="space-y-2">
                <Label>Preferences</Label>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="notifications"
                            checked={preferences.notifications}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                notifications: e.target.checked
                            })}
                        />
                        <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="theme">Theme:</Label>
                        <select
                            id="theme"
                            value={preferences.theme}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                theme: e.target.value
                            })}
                            className="px-2 py-1 border rounded"
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TimerExample = () => {
    const { timeLeft, isRunning, start, pause, reset } = useTimer(30);

    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className="text-6xl font-bold mb-4">
                    {timeLeft}
                </div>
                <Progress value={((30 - timeLeft) / 30) * 100} className="mb-4" />
                <div className="flex gap-2 justify-center">
                    <Button onClick={start} disabled={isRunning || timeLeft === 0}>
                        <Timer className="h-4 w-4 mr-2" />
                        Start
                    </Button>
                    <Button onClick={pause} disabled={!isRunning} variant="outline">
                        Pause
                    </Button>
                    <Button onClick={reset} variant="outline">
                        Reset
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ShoppingCartExample = () => {
    const { items, totalItems, totalPrice, addItem, removeItem, clear } = useShoppingCart();

    const products = [
        { id: '1', name: 'React Book', price: 29.99 },
        { id: '2', name: 'TypeScript Guide', price: 39.99 },
        { id: '3', name: 'Node.js Course', price: 49.99 }
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {products.map(product => (
                    <Card key={product.id}>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold">{product.name}</h3>
                                <p className="text-lg font-bold">${product.price}</p>
                                <Button onClick={() => addItem(product)} className="w-full">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Shopping Cart</span>
                        <Button onClick={clear} variant="outline" size="sm">
                            Clear
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {items.length === 0 ? (
                        <p className="text-muted-foreground">Your cart is empty</p>
                    ) : (
                        <div className="space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <span>{item.name} x{item.quantity}</span>
                                    <div className="flex items-center gap-2">
                                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                                        <Button
                                            onClick={() => removeItem(item.id)}
                                            variant="outline"
                                            size="sm"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <div className="border-t pt-2 mt-2">
                                <div className="flex justify-between font-bold">
                                    <span>Total: {totalItems} items</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const OnlineStatusExample = () => {
    const { isOnline, lastChanged } = useOnlineStatus();

    return (
        <div className="space-y-4">
            <div className="text-center">
                <div className={`text-6xl mb-4 ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isOnline ? <Wifi className="h-16 w-16 mx-auto" /> : <Bell className="h-16 w-16 mx-auto" />}
                </div>
                <div className="text-2xl font-bold mb-2">
                    {isOnline ? 'Online' : 'Offline'}
                </div>
                {lastChanged && (
                    <div className="text-sm text-muted-foreground">
                        Last changed: {lastChanged.toLocaleString()}
                    </div>
                )}
            </div>

            <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                    Try disconnecting your internet or switching to airplane mode to see the status change
                </AlertDescription>
            </Alert>
        </div>
    );
};

const SearchExample = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const allItems = [
        { id: 1, name: 'React Hooks', category: 'Frontend' },
        { id: 2, name: 'TypeScript', category: 'Language' },
        { id: 3, name: 'Node.js', category: 'Backend' },
        { id: 4, name: 'Next.js', category: 'Framework' },
        { id: 5, name: 'GraphQL', category: 'API' },
        { id: 6, name: 'MongoDB', category: 'Database' }
    ];

    const { results, isSearching } = useSearch(
        allItems,
        searchTerm,
        (item, term) =>
            item.name.toLowerCase().includes(term.toLowerCase()) ||
            item.category.toLowerCase().includes(term.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="flex-1">
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                    />
                </div>
                <Button onClick={() => setSearchTerm('')} variant="outline">
                    Clear
                </Button>
            </div>

            {isSearching && (
                <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 animate-spin" />
                    <span>Searching...</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(item => (
                    <Card key={item.id}>
                        <CardContent className="pt-6">
                            <div className="space-y-2">
                                <h3 className="font-semibold">{item.name}</h3>
                                <Badge variant="outline">{item.category}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {results.length === 0 && searchTerm && (
                <div className="text-center py-8 text-muted-foreground">
                    No results found for "{searchTerm}"
                </div>
            )}
        </div>
    );
};

const FetchExample = () => {
    const [url, setUrl] = useState('/api/users');
    const [enabled, setEnabled] = useState(true);
    const { data, loading, error } = useFetch<{ message: string; timestamp: string }>(url, enabled);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="url">API URL</Label>
                <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Enter API URL"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="enabled"
                    checked={enabled}
                    onChange={(e) => setEnabled(e.target.checked)}
                />
                <Label htmlFor="enabled">Enable fetching</Label>
            </div>

            <Card>
                <CardContent className="pt-6">
                    {loading && (
                        <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 animate-spin" />
                            <span>Loading...</span>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>Error: {error}</AlertDescription>
                        </Alert>
                    )}

                    {data && (
                        <div className="space-y-2">
                            <div><strong>Message:</strong> {data.message}</div>
                            <div><strong>Timestamp:</strong> {data.timestamp}</div>
                        </div>
                    )}

                    {!loading && !error && !data && (
                        <div className="text-muted-foreground">
                            {enabled ? 'No data' : 'Fetching disabled'}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default function UseDebugValueDemo() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useDebugValue Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Learn how to add debug labels to custom hooks for better development experience
                </p>
            </div>

            {/* Important Notice */}
            <Alert>
                <Bug className="h-4 w-4" />
                <AlertDescription>
                    <strong>Open React DevTools</strong> to see the debug values in action!
                    Look for the custom hook names in the Components tab.
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                    <TabsTrigger value="formatted">Formatted Values</TabsTrigger>
                    <TabsTrigger value="complex">Complex State</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Basic Counter */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Simple</Badge>
                                <Code className="h-4 w-4" />
                                Basic Debug Value
                            </CardTitle>
                            <CardDescription>
                                Simple useDebugValue with primitive values
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CounterExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    function useCounter() {'{'}<br />
                                    &nbsp;&nbsp;const [count, setCount] = useState(0)<br />
                                    &nbsp;&nbsp;useDebugValue(count)<br />
                                    &nbsp;&nbsp;return {'{'} count, increment, decrement {'}'}<br />
                                    {'}'}
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Online Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Status</Badge>
                                <Wifi className="h-4 w-4" />
                                Online Status Hook
                            </CardTitle>
                            <CardDescription>
                                Track online/offline status with debug information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OnlineStatusExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;{'{'} isOnline, lastChanged {'}'},<br />
                                    &nbsp;&nbsp;({'{'} isOnline, lastChanged {'}'}) =&gt; <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;`${'${isOnline ? "🟢 Online" : "🔴 Offline"}'} (changed: ${'${time}'})`<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fetch Hook */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Fetch</Badge>
                                <Globe className="h-4 w-4" />
                                Data Fetching Hook
                            </CardTitle>
                            <CardDescription>
                                HTTP data fetching with conditional debug values based on state
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FetchExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(state, (state) =&gt; {'{'}<br />
                                    &nbsp;&nbsp;if (state.error) return `❌ Error: ${'${state.error}'}`<br />
                                    &nbsp;&nbsp;if (state.loading) return `⏳ Loading: ${'${state.url}'}`<br />
                                    &nbsp;&nbsp;if (state.data) return `✅ Success: ${'${state.url}'}`<br />
                                    &nbsp;&nbsp;return `⚪ Idle: ${'${state.url}'}`<br />
                                    {'}'})
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="formatted" className="space-y-6">
                    {/* User Hook */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Formatted</Badge>
                                <User className="h-4 w-4" />
                                User Data Hook
                            </CardTitle>
                            <CardDescription>
                                Custom formatting function for complex object debugging
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <UserExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;user,<br />
                                    &nbsp;&nbsp;user =&gt; `User: ${'${user.name}'} (${'${user.status}'})`<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timer Hook */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                <Timer className="h-4 w-4" />
                                Timer Hook with Progress
                            </CardTitle>
                            <CardDescription>
                                Timer with detailed debug information including progress
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TimerExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;{'{'} timeLeft, isRunning, duration {'}'},<br />
                                    &nbsp;&nbsp;({'{'} timeLeft, isRunning, duration {'}'}) =&gt; {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;const progress = ((duration - timeLeft) / duration * 100).toFixed(1)<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;const status = isRunning ? '▶️' : timeLeft === 0 ? '🏁' : '⏸️'<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;return `${'${status}'} Timer: ${'${timeLeft}'}s (${'${progress}'}%)`<br />
                                    &nbsp;&nbsp;{'}'}<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="complex" className="space-y-6">
                    {/* Shopping Cart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Complex</Badge>
                                <ShoppingCart className="h-4 w-4" />
                                Shopping Cart Hook
                            </CardTitle>
                            <CardDescription>
                                Complex state with computed values and detailed debugging
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ShoppingCartExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;{'{'} items, totalItems, totalPrice {'}'},<br />
                                    &nbsp;&nbsp;({'{'} items, totalItems, totalPrice {'}'}) =&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;`Cart: ${'${items.length}'} types, ${'${totalItems}'} items, $${'${totalPrice.toFixed(2)}'}`<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search Hook */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Search</Badge>
                                <Search className="h-4 w-4" />
                                Search Hook
                            </CardTitle>
                            <CardDescription>
                                Search functionality with result statistics in debug output
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;{'{'} searchTerm, totalItems, resultCount, isSearching {'}'},<br />
                                    &nbsp;&nbsp;({'{'} searchTerm, totalItems, resultCount, isSearching {'}'}) =&gt; {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;if (isSearching) return '🔍 Searching...'<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;if (!searchTerm) return `📋 All items (${'${totalItems}'})`<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;return `🔍 "${'${searchTerm}'}": ${'${resultCount}'}/${'${totalItems}'} results`<br />
                                    &nbsp;&nbsp;{'}'}<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    {/* LocalStorage Hook */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Storage</Badge>
                                <Database className="h-4 w-4" />
                                LocalStorage Hook
                            </CardTitle>
                            <CardDescription>
                                Efficient debugging with formatter function to avoid performance issues
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <LocalStorageExample />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useDebugValue(<br />
                                    &nbsp;&nbsp;{'{'} key, value: storedValue {'}'},<br />
                                    &nbsp;&nbsp;({'{'} key, value {'}'}) =&gt; <br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;`localStorage[${'${key}'}]: ${'${JSON.stringify(value).slice(0, 50)}'}...`<br />
                                    )
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Performance Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Tips</Badge>
                                <Zap className="h-4 w-4" />
                                Performance Best Practices
                            </CardTitle>
                            <CardDescription>
                                Important considerations when using useDebugValue
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Alert>
                                    <Settings className="h-4 w-4" />
                                    <AlertDescription>
                                        <strong>Development Only:</strong> useDebugValue only runs in development mode
                                        and is automatically stripped from production builds.
                                    </AlertDescription>
                                </Alert>

                                <Alert>
                                    <Zap className="h-4 w-4" />
                                    <AlertDescription>
                                        <strong>Use Formatter Functions:</strong> For expensive computations,
                                        always use the formatter function to avoid performance issues.
                                    </AlertDescription>
                                </Alert>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-green-600">✅ Good practices:</h4>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• Use formatter functions for objects</li>
                                            <li>• Keep debug strings concise</li>
                                            <li>• Only debug meaningful state</li>
                                            <li>• Use emojis for quick visual identification</li>
                                            <li>• Include relevant context</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-red-600">❌ Avoid:</h4>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• Expensive computations without formatter</li>
                                            <li>• Very long debug strings</li>
                                            <li>• Debugging every single state</li>
                                            <li>• Complex nested objects</li>
                                            <li>• Side effects in debug values</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Key Concepts */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">🔍 Development Only</h4>
                            <p className="text-sm text-muted-foreground">
                                useDebugValue only runs in development mode and is automatically removed from production builds.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🏷️ Custom Hook Labels</h4>
                            <p className="text-sm text-muted-foreground">
                                Adds meaningful labels to custom hooks in React DevTools Components tab.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Formatter Function</h4>
                            <p className="text-sm text-muted-foreground">
                                Use formatter functions for expensive computations to avoid performance issues.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">📊 State Visibility</h4>
                            <p className="text-sm text-muted-foreground">
                                Makes internal hook state visible and easier to debug during development.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎯 Selective Debugging</h4>
                            <p className="text-sm text-muted-foreground">
                                Only add debug values for hooks that benefit from additional context in DevTools.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔧 DevTools Integration</h4>
                            <p className="text-sm text-muted-foreground">
                                Seamlessly integrates with React DevTools to provide better debugging experience.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}