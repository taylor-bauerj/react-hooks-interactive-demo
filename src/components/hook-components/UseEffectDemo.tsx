import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Play,
    Pause,
    RotateCcw,
    Eye,
    EyeOff,
    Wifi,
    WifiOff,
    Timer,
    MousePointer,
    Zap,
    AlertCircle
} from 'lucide-react'

interface User {
    id: number
    name: string
    email: string
}

export function UseEffectDemo() {
    // Example 1: Basic useEffect (component did mount)
    const [mountTime, setMountTime] = useState<string>('')
    const [renderCount, setRenderCount] = useState(0)

    // Example 2: useEffect with dependencies
    const [count, setCount] = useState(0)
    const [isEven, setIsEven] = useState(true)

    // Example 3: Cleanup function
    const [timer, setTimer] = useState(0)
    const [isTimerRunning, setIsTimerRunning] = useState(false)

    // Example 4: Window resize listener
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    // Example 5: Mouse position tracking
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
    const [isTrackingMouse, setIsTrackingMouse] = useState(false)

    // Example 6: Data fetching simulation
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Example 7: Search with debounce
    const [searchTerm, setSearchTerm] = useState('')
    const [searchResults, setSearchResults] = useState<string[]>([])
    const [isSearching, setIsSearching] = useState(false)

    // Example 8: Online/Offline status
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    // Example 9: Document title updates
    const [pageTitle, setPageTitle] = useState('useEffect Demo')

    // Example 10: Cleanup demonstration
    const [showCleanupDemo, setShowCleanupDemo] = useState(false)

    const timerRef = useRef<NodeJS.Timeout | null>(null)
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Effect 1: Component mount effect
    useEffect(() => {
        setMountTime(new Date().toLocaleTimeString())
        console.log('Component mounted!')

        return () => {
            console.log('Component will unmount!')
        }
    }, [])

    // Effect 2: Render count
    useEffect(() => {
        setRenderCount(prev => prev + 1)
    }, [setRenderCount])

    // Effect 3: Count dependency
    useEffect(() => {
        setIsEven(count % 2 === 0)
        console.log(`Count changed to: ${count}`)
    }, [count])

    // Effect 4: Timer with cleanup
    useEffect(() => {
        if (isTimerRunning) {
            timerRef.current = setInterval(() => {
                setTimer(prev => prev + 1)
            }, 1000)
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current)
            }
        }
    }, [isTimerRunning])

    // Effect 5: Window resize
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Effect 6: Mouse tracking
    useEffect(() => {
        if (!isTrackingMouse) return

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY })
        }

        document.addEventListener('mousemove', handleMouseMove)

        return () => document.removeEventListener('mousemove', handleMouseMove)
    }, [isTrackingMouse])

    // Effect 7: Search with debounce
    useEffect(() => {
        if (!searchTerm) {
            setSearchResults([])
            return
        }

        setIsSearching(true)

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            // Simulate search
            const mockResults = [
                'React Hooks',
                'useEffect Guide',
                'State Management',
                'Component Lifecycle',
                'Side Effects'
            ].filter(item =>
                item.toLowerCase().includes(searchTerm.toLowerCase())
            )

            setSearchResults(mockResults)
            setIsSearching(false)
        }, 500)

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [searchTerm])

    // Effect 8: Online/Offline detection
    useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    // Effect 9: Document title
    useEffect(() => {
        document.title = pageTitle

        return () => {
            document.title = 'React Hooks Demo'
        }
    }, [pageTitle])

    // Fetch users simulation
    const fetchUsers = async () => {
        setLoading(true)
        setError(null)

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Simulate random error
            if (Math.random() > 0.8) {
                throw new Error('Failed to fetch users')
            }

            const mockUsers: User[] = [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
                { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
            ]

            setUsers(mockUsers)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error')
        } finally {
            setLoading(false)
        }
    }

    // Cleanup demo component
    const CleanupDemo = () => {
        const [seconds, setSeconds] = useState(0)

        useEffect(() => {
            console.log('CleanupDemo: Effect started')
            const interval = setInterval(() => {
                setSeconds(prev => prev + 1)
            }, 1000)

            return () => {
                console.log('CleanupDemo: Cleanup executed')
                clearInterval(interval)
            }
        }, [])

        return (
            <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm">This component has been running for {seconds} seconds</p>
                <p className="text-xs text-muted-foreground mt-1">
                    Check the console to see cleanup logs when you hide this component
                </p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useEffect Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Learn how to handle side effects, subscriptions, and component lifecycle
                </p>
            </div>

            {/* Render info */}
            <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Component mounted at: <strong>{mountTime}</strong> |
                    Total renders: <strong>{renderCount}</strong> |
                    Online status: <strong className={isOnline ? 'text-green-600' : 'text-red-600'}>
                    {isOnline ? 'Connected' : 'Disconnected'}
                </strong>
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Effects</TabsTrigger>
                    <TabsTrigger value="cleanup">Cleanup & Timers</TabsTrigger>
                    <TabsTrigger value="events">Event Listeners</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Mount Effect */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Mount</Badge>
                                Component Lifecycle
                            </CardTitle>
                            <CardDescription>
                                useEffect with empty dependency array - runs once after mount
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 bg-muted rounded-lg">
                                    <p className="text-sm">
                                        <strong>Mounted at:</strong> {mountTime}
                                    </p>
                                    <p className="text-sm">
                                        <strong>Total renders:</strong> {renderCount}
                                    </p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  console.log('Component mounted!')\n  return () => console.log('Cleanup!')\n}, [])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dependency Effect */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Dependency</Badge>
                                Effect with Dependencies
                            </CardTitle>
                            <CardDescription>
                                useEffect that runs when specific values change
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-4">
                                    <Button
                                        onClick={() => setCount(count - 1)}
                                        variant="outline"
                                    >
                                        -1
                                    </Button>
                                    <div className="text-center min-w-[100px]">
                                        <div className="text-2xl font-bold">{count}</div>
                                        <Badge variant={isEven ? "default" : "secondary"}>
                                            {isEven ? 'Even' : 'Odd'}
                                        </Badge>
                                    </div>
                                    <Button
                                        onClick={() => setCount(count + 1)}
                                        variant="outline"
                                    >
                                        +1
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  setIsEven(count % 2 === 0)\n}, [count])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Document Title */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">DOM</Badge>
                                Document Title Update
                            </CardTitle>
                            <CardDescription>
                                Updating document title as a side effect
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter page title..."
                                    value={pageTitle}
                                    onChange={(e) => setPageTitle(e.target.value)}
                                />
                                <p className="text-sm text-muted-foreground">
                                    Look at the browser tab title - it updates in real-time!
                                </p>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  document.title = pageTitle\n}, [pageTitle])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cleanup" className="space-y-6">
                    {/* Timer with Cleanup */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                Timer with Cleanup
                            </CardTitle>
                            <CardDescription>
                                Managing intervals and cleaning up to prevent memory leaks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl font-bold font-mono">
                                        {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex justify-center space-x-2">
                                        <Button
                                            onClick={() => setIsTimerRunning(!isTimerRunning)}
                                            variant={isTimerRunning ? "destructive" : "default"}
                                        >
                                            {isTimerRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                            {isTimerRunning ? 'Pause' : 'Start'}
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setTimer(0)
                                                setIsTimerRunning(false)
                                            }}
                                            variant="outline"
                                        >
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  const interval = setInterval(() => {\n    setTimer(prev => prev + 1)\n  }, 1000)\n  return () => clearInterval(interval)\n}, [isTimerRunning])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Cleanup Demo */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Cleanup</Badge>
                                Cleanup Function Demo
                            </CardTitle>
                            <CardDescription>
                                See cleanup in action when components unmount
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button
                                    onClick={() => setShowCleanupDemo(!showCleanupDemo)}
                                    variant="outline"
                                >
                                    {showCleanupDemo ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                    {showCleanupDemo ? 'Hide' : 'Show'} Cleanup Demo
                                </Button>

                                {showCleanupDemo && <CleanupDemo />}

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Open your browser's developer console to see cleanup logs when you hide the component above.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="events" className="space-y-6">
                    {/* Window Resize */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Resize</Badge>
                                Window Resize Listener
                            </CardTitle>
                            <CardDescription>
                                Tracking window size changes with proper cleanup
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center space-y-2">
                                    <div className="text-lg font-semibold">
                                        {windowSize.width} × {windowSize.height}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Resize your browser window to see live updates
                                    </p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  const handleResize = () => setWindowSize({...})\n  window.addEventListener('resize', handleResize)\n  return () => window.removeEventListener('resize', handleResize)\n}, [])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Mouse Tracking */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Mouse</Badge>
                                Mouse Position Tracking
                            </CardTitle>
                            <CardDescription>
                                Conditional event listener based on state
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <Button
                                        onClick={() => setIsTrackingMouse(!isTrackingMouse)}
                                        variant={isTrackingMouse ? "destructive" : "default"}
                                    >
                                        <MousePointer className="h-4 w-4 mr-2" />
                                        {isTrackingMouse ? 'Stop Tracking' : 'Start Tracking'}
                                    </Button>

                                    {isTrackingMouse && (
                                        <div className="p-4 border rounded-lg bg-blue-50">
                                            <p className="text-sm">
                                                Mouse position: <strong>X: {mousePosition.x}, Y: {mousePosition.y}</strong>
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Move your mouse to see position updates
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  if (!isTrackingMouse) return\n  const handleMouseMove = (e) => {...}\n  document.addEventListener('mousemove', handleMouseMove)\n  return () => document.removeEventListener('mousemove', handleMouseMove)\n}, [isTrackingMouse])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Online/Offline */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Network</Badge>
                                Online/Offline Detection
                            </CardTitle>
                            <CardDescription>
                                Monitoring network connectivity status
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                                        isOnline
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {isOnline ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                                        {isOnline ? 'Online' : 'Offline'}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Try turning off your internet connection to see the status change
                                    </p>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  const handleOnline = () => setIsOnline(true)\n  const handleOffline = () => setIsOnline(false)\n  window.addEventListener('online', handleOnline)\n  window.addEventListener('offline', handleOffline)\n  return () => { /* cleanup */ }\n}, [])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {/* Data Fetching */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Async</Badge>
                                Data Fetching
                            </CardTitle>
                            <CardDescription>
                                Async operations with loading states and error handling
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button onClick={fetchUsers} disabled={loading}>
                                    <Zap className="h-4 w-4 mr-2" />
                                    {loading ? 'Loading...' : 'Fetch Users'}
                                </Button>

                                {loading && (
                                    <div className="space-y-2">
                                        <Progress value={undefined} className="w-full" />
                                        <p className="text-sm text-muted-foreground">Fetching users...</p>
                                    </div>
                                )}

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {users.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Users:</h4>
                                        {users.map(user => (
                                            <div key={user.id} className="p-2 border rounded">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Debounced Search */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Debounce</Badge>
                                Debounced Search
                            </CardTitle>
                            <CardDescription>
                                Search with debouncing to avoid excessive API calls
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        placeholder="Search for tutorials..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {isSearching && (
                                        <div className="absolute right-2 top-2">
                                            <Timer className="h-4 w-4 animate-spin" />
                                        </div>
                                    )}
                                </div>

                                {searchResults.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Found {searchResults.length} results:
                                        </p>
                                        {searchResults.map((result, index) => (
                                            <div key={index} className="p-2 border rounded text-sm">
                                                {result}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`useEffect(() => {\n  const timeout = setTimeout(() => {\n    // Perform search\n  }, 500)\n  return () => clearTimeout(timeout)\n}, [searchTerm])`}
                                    </code>
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
                            <h4 className="font-medium">🔄 Dependency Array</h4>
                            <p className="text-sm text-muted-foreground">
                                Controls when the effect runs. Empty array = once, no array = every render, with deps = when deps change.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🧹 Cleanup Function</h4>
                            <p className="text-sm text-muted-foreground">
                                Return a function to clean up subscriptions, timers, and event listeners.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚠️ Infinite Loops</h4>
                            <p className="text-sm text-muted-foreground">
                                Be careful with dependencies to avoid infinite re-renders.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🚫 Async Effects</h4>
                            <p className="text-sm text-muted-foreground">
                                useEffect callback can't be async. Use async functions inside instead.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}