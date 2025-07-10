import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Minus, RotateCcw, Heart, ShoppingCart, Trash2 } from 'lucide-react'

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

export default function UseStateDemo() {
    // Example 1: Simple counter
    const [count, setCount] = useState(0)

    // Example 2: String state
    const [name, setName] = useState('')

    // Example 3: Boolean state
    const [isLiked, setIsLiked] = useState(false)

    // Example 4: Complex state (object)
    const [user, setUser] = useState({
        name: 'John Doe',
        age: 25,
        email: 'john@example.com'
    })

    // Example 5: Array state
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: 1, text: 'Learn React', completed: true },
        { id: 2, text: 'Master useState', completed: false }
    ])
    const [newTodo, setNewTodo] = useState('')

    // Example 6: Shopping cart
    const [cartItems, setCartItems] = useState<Array<{id: number, name: string, quantity: number}>>([])

    const addTodo = () => {
        if (newTodo.trim()) {
            setTodos([...todos, {
                id: Date.now(),
                text: newTodo,
                completed: false
            }])
            setNewTodo('')
        }
    }

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ))
    }

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id))
    }

    const addToCart = (item: {id: number, name: string}) => {
        setCartItems(prev => {
            const existing = prev.find(cartItem => cartItem.id === item.id)
            if (existing) {
                return prev.map(cartItem =>
                    cartItem.id === item.id
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                )
            }
            return [...prev, { ...item, quantity: 1 }]
        })
    }

    const products = [
        { id: 1, name: 'React Handbook' },
        { id: 2, name: 'TypeScript Guide' },
        { id: 3, name: 'Next.js Course' }
    ]

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useState Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Explore different ways to use React's useState hook for state management
                </p>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Examples</TabsTrigger>
                    <TabsTrigger value="complex">Complex State</TabsTrigger>
                    <TabsTrigger value="practical">Practical Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Counter Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Number</Badge>
                                Simple Counter
                            </CardTitle>
                            <CardDescription>
                                Basic numeric state management with increment/decrement
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-center space-x-4">
                                <Button
                                    onClick={() => setCount(count - 1)}
                                    variant="outline"
                                    size="icon"
                                >
                                    <Minus className="h-4 w-4" />
                                </Button>
                                <div className="text-4xl font-bold min-w-[100px] text-center">
                                    {count}
                                </div>
                                <Button
                                    onClick={() => setCount(count + 1)}
                                    variant="outline"
                                    size="icon"
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => setCount(0)}
                                    variant="outline"
                                    size="icon"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    const [count, setCount] = useState(0)
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* String State Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">String</Badge>
                                Text Input
                            </CardTitle>
                            <CardDescription>
                                Managing string state with controlled input
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Input
                                    placeholder="Enter your name..."
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <div className="text-center">
                                    {name ? (
                                        <p className="text-lg">Hello, <span className="font-semibold">{name}</span>!</p>
                                    ) : (
                                        <p className="text-muted-foreground">Enter your name above</p>
                                    )}
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const [name, setName] = useState('')
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Boolean State Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Boolean</Badge>
                                Like Button
                            </CardTitle>
                            <CardDescription>
                                Toggle boolean state for interactive elements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <Button
                                    onClick={() => setIsLiked(!isLiked)}
                                    variant={isLiked ? "default" : "outline"}
                                    size="lg"
                                    className="transition-all"
                                >
                                    <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                    {isLiked ? 'Liked!' : 'Like this'}
                                </Button>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const [isLiked, setIsLiked] = useState(false)
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="complex" className="space-y-6">
                    {/* Object State Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Object</Badge>
                                User Profile
                            </CardTitle>
                            <CardDescription>
                                Managing complex object state with proper immutability
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={user.name}
                                            onChange={(e) => setUser({...user, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Age</label>
                                        <Input
                                            type="number"
                                            value={user.age}
                                            onChange={(e) => setUser({...user, age: parseInt(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={user.email}
                                            onChange={(e) => setUser({...user, email: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Current User:</h4>
                                    <pre className="text-sm">{JSON.stringify(user, null, 2)}</pre>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="practical" className="space-y-6">
                    {/* Todo List Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Array</Badge>
                                Todo List
                            </CardTitle>
                            <CardDescription>
                                Managing array state with add, update, and delete operations
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
                                    <Button onClick={addTodo}>Add</Button>
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
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shopping Cart Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Complex</Badge>
                                Shopping Cart
                            </CardTitle>
                            <CardDescription>
                                Advanced state management with conditional updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {products.map(product => (
                                        <div key={product.id} className="border rounded-lg p-4">
                                            <h4 className="font-medium">{product.name}</h4>
                                            <Button
                                                onClick={() => addToCart(product)}
                                                className="mt-2 w-full"
                                                size="sm"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {cartItems.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-2">Cart ({cartItems.length} items)</h4>
                                        {cartItems.map(item => (
                                            <div key={item.id} className="flex justify-between items-center">
                                                <span>{item.name}</span>
                                                <Badge variant="secondary">×{item.quantity}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                            <h4 className="font-medium">✨ State Updates</h4>
                            <p className="text-sm text-muted-foreground">
                                React state updates are asynchronous and may be batched for performance.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 Immutability</h4>
                            <p className="text-sm text-muted-foreground">
                                Always create new objects/arrays instead of mutating existing state.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎯 Functional Updates</h4>
                            <p className="text-sm text-muted-foreground">
                                Use functions for state updates when the new state depends on the previous state.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Performance</h4>
                            <p className="text-sm text-muted-foreground">
                                React only re-renders when state actually changes (using Object.is comparison).
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}