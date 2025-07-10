import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Play,
    Pause,
    RotateCcw,
    AlertCircle,
    Search,
    Plus,
    Trash2,
    Clock,
    TrendingUp
} from 'lucide-react'

interface Todo {
    id: number
    text: string
    completed: boolean
}

interface ExpensiveItem {
    id: number
    name: string
    category: string
    price: number
}

// Child component that shows re-render count
const RenderCounter = ({ name, onAction }: { name: string; onAction: () => void }) => {
    const renderCount = useRef(0)
    renderCount.current++

    console.log(`${name} rendered ${renderCount.current} times`)

    return (
        <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{name}</span>
                <Badge variant="outline">Renders: {renderCount.current}</Badge>
            </div>
            <Button onClick={onAction} size="sm" variant="outline">
                Click Me
            </Button>
        </div>
    )
}

// Expensive computation component for demonstration
const ExpensiveList = ({ items, onItemClick }: { items: ExpensiveItem[]; onItemClick: (item: ExpensiveItem) => void }) => {
    const renderCount = useRef(0)
    renderCount.current++

    // Simulate expensive computation
    const expensiveValue = useMemo(() => {
        console.log('Expensive computation running...')
        let sum = 0
        for (let i = 0; i < 1000000; i++) {
            sum += i
        }
        return sum
    }, [])

    return (
        <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Expensive List</span>
                <Badge variant="outline">Renders: {renderCount.current}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
                Expensive computation result: {expensiveValue}
            </p>
            <div className="space-y-1">
                {items.map(item => (
                    <div key={item.id} className="text-sm p-2 border rounded flex justify-between items-center">
                        <span>{item.name} - ${item.price}</span>
                        <Button size="sm" variant="ghost" onClick={() => onItemClick(item)}>
                            Select
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Search component that demonstrates useCallback with debouncing
const SearchComponent = ({ onSearch }: { onSearch: (term: string) => void }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const renderCount = useRef(0)
    renderCount.current++

    const debouncedSearch = useCallback((term: string) => {
        const timeoutId = setTimeout(() => {
            onSearch(term)
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [onSearch])

    useEffect(() => {
        const cleanup = debouncedSearch(searchTerm)
        return cleanup
    }, [searchTerm, debouncedSearch])

    return (
        <div className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Search Component</span>
                <Badge variant="outline">Renders: {renderCount.current}</Badge>
            </div>
            <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    )
}

export function UseCallbackDemo() {
    // Example 1: Basic useCallback demonstration
    const [count, setCount] = useState(0)
    const [name, setName] = useState('John')

    // Without useCallback - creates new function on every render
    const handleClickWithoutCallback = () => {
        console.log('Button clicked without useCallback')
    }

    // With useCallback - same function reference unless dependencies change
    const handleClickWithCallback = useCallback(() => {
        console.log('Button clicked with useCallback')
    }, [])

    // Example 2: useCallback with dependencies
    const handleCountUpdate = useCallback(() => {
        setCount(prev => prev + 1)
        console.log('Count updated:', count)
    }, [count])

    // Example 3: Complex todo list with useCallback
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Learn React', completed: false },
        { id: 2, text: 'Master useCallback', completed: false }
    ])
    const [newTodo, setNewTodo] = useState('')

    const addTodo = useCallback(() => {
        if (newTodo.trim()) {
            setTodos(prev => [...prev, {
                id: Date.now(),
                text: newTodo,
                completed: false
            }])
            setNewTodo('')
        }
    }, [newTodo])

    const toggleTodo = useCallback((id: number) => {
        setTodos(prev => prev.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }, [])

    const deleteTodo = useCallback((id: number) => {
        setTodos(prev => prev.filter(todo => todo.id !== id))
    }, [])

    // Example 4: Timer with useCallback
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const startTimer = useCallback(() => {
        setIsRunning(true)
        timerRef.current = setInterval(() => {
            setSeconds(prev => prev + 1)
        }, 1000)
    }, [])

    const stopTimer = useCallback(() => {
        setIsRunning(false)
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    const resetTimer = useCallback(() => {
        setSeconds(0)
        setIsRunning(false)
        if (timerRef.current) {
            clearInterval(timerRef.current)
            timerRef.current = null
        }
    }, [])

    // Example 5: Expensive operations with useCallback
    const [items] = useState<ExpensiveItem[]>([
        { id: 1, name: 'Laptop', category: 'Electronics', price: 999 },
        { id: 2, name: 'Phone', category: 'Electronics', price: 699 },
        { id: 3, name: 'Book', category: 'Education', price: 29 },
        { id: 4, name: 'Headphones', category: 'Electronics', price: 199 }
    ])
    const [selectedItem, setSelectedItem] = useState<ExpensiveItem | null>(null)

    const handleItemClick = useCallback((item: ExpensiveItem) => {
        setSelectedItem(item)
        console.log('Item selected:', item.name)
    }, [])

    // Example 6: Search with useCallback
    const [searchResults, setSearchResults] = useState<string[]>([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = useCallback((term: string) => {
        setIsSearching(true)

        // Simulate API call
        setTimeout(() => {
            const results = [
                'React Hooks Tutorial',
                'useCallback Examples',
                'Performance Optimization',
                'React Best Practices',
                'State Management Guide'
            ].filter(item => item.toLowerCase().includes(term.toLowerCase()))

            setSearchResults(results)
            setIsSearching(false)
        }, 500)
    }, [])

    // Example 7: Form handlers with useCallback
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateField = useCallback((field: string, value: string) => {
        const newErrors = { ...errors }

        switch (field) {
            case 'email':
                if (!value.includes('@')) {
                    newErrors.email = 'Invalid email format'
                } else {
                    delete newErrors.email
                }
                break
            case 'password':
                if (value.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters'
                } else {
                    delete newErrors.password
                }
                break
            case 'confirmPassword':
                if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match'
                } else {
                    delete newErrors.confirmPassword
                }
                break
        }

        setErrors(newErrors)
    }, [errors, formData.password])

    const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setFormData(prev => ({ ...prev, [field]: value }))
        validateField(field, value)
    }, [validateField])

    // Example 8: Event handler factory with useCallback
    const handleButtonClick = useCallback((variant: string) => {
        console.log(`${variant} button clicked`)
    }, [])

    const createButtonHandler = useCallback((variant: string) => () => {
        handleButtonClick(variant)
    }, [handleButtonClick])

    // Performance tracking
    const [performanceMetrics, setPerformanceMetrics] = useState({
        renderCount: 0,
        callbackCreations: 0
    })

    useEffect(() => {
        setPerformanceMetrics(prev => ({
            ...prev,
            renderCount: prev.renderCount + 1
        }))
    }, [setPerformanceMetrics])

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useCallback Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Learn how to optimize performance by memoizing callback functions
                </p>
            </div>

            {/* Performance Metrics */}
            <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertDescription>
                    Component renders: <strong>{performanceMetrics.renderCount}</strong> |
                    Open DevTools Console to see render logs and callback optimizations
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Concepts</TabsTrigger>
                    <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
                    <TabsTrigger value="optimization">Performance</TabsTrigger>
                    <TabsTrigger value="patterns">Advanced Patterns</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Basic useCallback */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Basic</Badge>
                                Function Reference Stability
                            </CardTitle>
                            <CardDescription>
                                Compare function creation with and without useCallback
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <RenderCounter
                                        name="Without useCallback"
                                        onAction={handleClickWithoutCallback}
                                    />
                                    <RenderCounter
                                        name="With useCallback"
                                        onAction={handleClickWithCallback}
                                    />
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`// Without useCallback - new function every render
const handleClick = () => console.log('clicked')

// With useCallback - same function reference
const handleClick = useCallback(() => {
  console.log('clicked')
}, [])`}
                                    </code>
                                </div>
                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Check the console to see how many times each child component renders when you interact with other elements.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Counter Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">State</Badge>
                                Counter with useCallback
                            </CardTitle>
                            <CardDescription>
                                Simple counter demonstrating basic useCallback usage
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl font-bold">{count}</div>
                                    <div className="space-x-2">
                                        <Button onClick={() => setCount(c => c - 1)} variant="outline">
                                            -1
                                        </Button>
                                        <Button onClick={handleCountUpdate} variant="default">
                                            +1 (useCallback)
                                        </Button>
                                        <Button onClick={() => setCount(0)} variant="outline">
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const handleCountUpdate = useCallback(() => {
  setCount(prev => prev + 1)
}, [count]) // Depends on count`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Name Update */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Input</Badge>
                                Name Update
                            </CardTitle>
                            <CardDescription>
                                Change the name to see how it affects other callbacks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="text-center">
                                    <p className="text-lg">Hello, <strong>{name}</strong>!</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Notice how changing the name affects the counter callback that depends on count.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="dependencies" className="space-y-6">
                    {/* Timer Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                Timer with useCallback
                            </CardTitle>
                            <CardDescription>
                                Timer controls with properly memoized callbacks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center space-y-4">
                                    <div className="text-4xl font-bold font-mono">
                                        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex justify-center space-x-2">
                                        <Button
                                            onClick={isRunning ? stopTimer : startTimer}
                                            variant={isRunning ? "destructive" : "default"}
                                        >
                                            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                            {isRunning ? 'Stop' : 'Start'}
                                        </Button>
                                        <Button onClick={resetTimer} variant="outline">
                                            <RotateCcw className="h-4 w-4 mr-2" />
                                            Reset
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const startTimer = useCallback(() => {
  setIsRunning(true)
  timerRef.current = setInterval(() => {
    setSeconds(prev => prev + 1)
  }, 1000)
}, []) // No dependencies needed`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Todo List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">CRUD</Badge>
                                Todo List with useCallback
                            </CardTitle>
                            <CardDescription>
                                Interactive todo list showing useCallback with different dependencies
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a new todo..."
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                    />
                                    <Button onClick={addTodo}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {todos.map(todo => (
                                        <div key={todo.id} className="flex items-center gap-2 p-2 border rounded">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => toggleTodo(todo.id)}
                                                className="h-4 w-4"
                                            />
                                            <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                {todo.text}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteTodo(todo.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const addTodo = useCallback(() => {
  if (newTodo.trim()) {
    setTodos(prev => [...prev, {...}])
    setNewTodo('')
  }
}, [newTodo]) // Depends on newTodo

const toggleTodo = useCallback((id: number) => {
  setTodos(prev => prev.map(todo =>
    todo.id === id ? {...todo, completed: !todo.completed} : todo
  ))
}, []) // No dependencies - uses function update`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-6">
                    {/* Expensive Operations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Performance</Badge>
                                Expensive Operations
                            </CardTitle>
                            <CardDescription>
                                Preventing unnecessary re-renders of expensive components
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ExpensiveList items={items} onItemClick={handleItemClick} />

                                {selectedItem && (
                                    <div className="p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm">
                                            <strong>Selected:</strong> {selectedItem.name} - ${selectedItem.price}
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button onClick={() => setCount(c => c + 1)} variant="outline">
                                        Increment Counter (Test Re-render)
                                    </Button>
                                    <Button onClick={() => setName(n => n + '!')}>
                                        Change Name (Test Re-render)
                                    </Button>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const handleItemClick = useCallback((item: ExpensiveItem) => {
  setSelectedItem(item)
}, []) // Stable reference prevents ExpensiveList re-render`}
                                    </code>
                                </div>

                                <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Without useCallback, the ExpensiveList would re-render every time the parent component updates, causing the expensive computation to run again.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Search</Badge>
                                Debounced Search
                            </CardTitle>
                            <CardDescription>
                                Search with debouncing using useCallback
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <SearchComponent onSearch={handleSearch} />

                                {isSearching && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 animate-spin" />
                                        <span className="text-sm">Searching...</span>
                                    </div>
                                )}

                                {searchResults.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Found {searchResults.length} results:
                                        </p>
                                        {searchResults.map((result, index) => (
                                            <div key={index} className="p-2 border rounded text-sm">
                                                <Search className="h-3 w-3 inline mr-2" />
                                                {result}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const handleSearch = useCallback((term: string) => {
  // Debounced search logic
  setTimeout(() => {
    // Perform search
  }, 300)
}, []) // Stable reference for child component`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="patterns" className="space-y-6">
                    {/* Form Validation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Form</Badge>
                                Dynamic Form Handlers
                            </CardTitle>
                            <CardDescription>
                                Form validation with dynamic useCallback handlers
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input
                                        type="email"
                                        placeholder="Enter email..."
                                        value={formData.email}
                                        onChange={handleInputChange('email')}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Enter password..."
                                        value={formData.password}
                                        onChange={handleInputChange('password')}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Confirm Password</label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm password..."
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange('confirmPassword')}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const handleInputChange = useCallback((field: string) => 
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({...prev, [field]: value}))
    validateField(field, value)
  }, [validateField]) // Depends on validateField`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Event Handler Factory */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Factory</Badge>
                                Event Handler Factory
                            </CardTitle>
                            <CardDescription>
                                Creating multiple handlers with useCallback
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {(['default', 'secondary', 'destructive', 'outline'] as const).map((variant) => (
                                        <Button
                                            key={variant}
                                            variant={variant}
                                            onClick={createButtonHandler(variant)}
                                        >
                                            {variant}
                                        </Button>
                                    ))}
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`// Factory pattern with useCallback
const createHandler = useCallback((type: string) => () => {
  console.log(\`\${type} button clicked\`)
}, [])

// Usage in render
onClick={createHandler('primary')}`}
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
                            <h4 className="font-medium">🎯 Purpose</h4>
                            <p className="text-sm text-muted-foreground">
                                useCallback returns a memoized callback that only changes if dependencies change.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Performance</h4>
                            <p className="text-sm text-muted-foreground">
                                Prevents unnecessary re-renders of child components that depend on callback props.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔗 Dependencies</h4>
                            <p className="text-sm text-muted-foreground">
                                Include all values from component scope that are used inside the callback.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚠️ When to Use</h4>
                            <p className="text-sm text-muted-foreground">
                                Use when passing callbacks to optimized child components or expensive operations.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}