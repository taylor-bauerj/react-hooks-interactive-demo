import { useReducer, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Plus,
    Minus,
    RotateCcw,
    Play,
    Pause,
    Square,
    ShoppingCart,
    Trash2,
    Edit3,
    Check,
    X,
    Save,
    Loader2
} from 'lucide-react'

// Counter Reducer
interface CounterState {
    count: number
    step: number
}

type CounterAction =
    | { type: 'INCREMENT' }
    | { type: 'DECREMENT' }
    | { type: 'RESET' }
    | { type: 'SET_STEP'; payload: number }
    | { type: 'SET_COUNT'; payload: number }

const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
    switch (action.type) {
        case 'INCREMENT':
            return { ...state, count: state.count + state.step }
        case 'DECREMENT':
            return { ...state, count: state.count - state.step }
        case 'RESET':
            return { ...state, count: 0 }
        case 'SET_STEP':
            return { ...state, step: action.payload }
        case 'SET_COUNT':
            return { ...state, count: action.payload }
        default:
            return state
    }
}

// Timer Reducer
interface TimerState {
    seconds: number
    isRunning: boolean
    interval: number
}

type TimerAction =
    | { type: 'START' }
    | { type: 'PAUSE' }
    | { type: 'STOP' }
    | { type: 'TICK' }
    | { type: 'SET_INTERVAL'; payload: number }

const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
    switch (action.type) {
        case 'START':
            return { ...state, isRunning: true }
        case 'PAUSE':
            return { ...state, isRunning: false }
        case 'STOP':
            return { ...state, isRunning: false, seconds: 0 }
        case 'TICK':
            return state.isRunning ? { ...state, seconds: state.seconds + 1 } : state
        case 'SET_INTERVAL':
            return { ...state, interval: action.payload }
        default:
            return state
    }
}

// Todo Reducer
interface Todo {
    id: string
    text: string
    completed: boolean
    priority: 'low' | 'medium' | 'high'
}

interface TodoState {
    todos: Todo[]
    filter: 'all' | 'active' | 'completed'
    editingId: string | null
}

type TodoAction =
    | { type: 'ADD_TODO'; payload: { text: string; priority: 'low' | 'medium' | 'high' } }
    | { type: 'TOGGLE_TODO'; payload: string }
    | { type: 'DELETE_TODO'; payload: string }
    | { type: 'EDIT_TODO'; payload: string }
    | { type: 'UPDATE_TODO'; payload: { id: string; text: string } }
    | { type: 'CANCEL_EDIT' }
    | { type: 'SET_FILTER'; payload: 'all' | 'active' | 'completed' }
    | { type: 'CLEAR_COMPLETED' }
    | { type: 'SET_PRIORITY'; payload: { id: string; priority: 'low' | 'medium' | 'high' } }

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'ADD_TODO':
            return {
                ...state,
                todos: [...state.todos, {
                    id: Date.now().toString(),
                    text: action.payload.text,
                    completed: false,
                    priority: action.payload.priority
                }]
            }
        case 'TOGGLE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
                )
            }
        case 'DELETE_TODO':
            return {
                ...state,
                todos: state.todos.filter(todo => todo.id !== action.payload)
            }
        case 'EDIT_TODO':
            return {
                ...state,
                editingId: action.payload
            }
        case 'UPDATE_TODO':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id ? { ...todo, text: action.payload.text } : todo
                ),
                editingId: null
            }
        case 'CANCEL_EDIT':
            return {
                ...state,
                editingId: null
            }
        case 'SET_FILTER':
            return {
                ...state,
                filter: action.payload
            }
        case 'CLEAR_COMPLETED':
            return {
                ...state,
                todos: state.todos.filter(todo => !todo.completed)
            }
        case 'SET_PRIORITY':
            return {
                ...state,
                todos: state.todos.map(todo =>
                    todo.id === action.payload.id ? { ...todo, priority: action.payload.priority } : todo
                )
            }
        default:
            return state
    }
}

// Shopping Cart Reducer
interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface CartState {
    items: CartItem[]
    discount: number
    shipping: number
    tax: number
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: string }
    | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
    | { type: 'APPLY_DISCOUNT'; payload: number }
    | { type: 'SET_SHIPPING'; payload: number }
    | { type: 'CLEAR_CART' }
    | { type: 'CALCULATE_TAX' }

const cartReducer = (state: CartState, action: CartAction): CartState => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id)
            if (existingItem) {
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? {...item, quantity: item.quantity + 1}
                            : item
                    )
                }
            }
            return {
                ...state,
                items: [...state.items, {...action.payload, quantity: 1}]
            }
        }
        case 'REMOVE_ITEM':
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            }
        case 'UPDATE_QUANTITY':
            if (action.payload.quantity <= 0) {
                return {
                    ...state,
                    items: state.items.filter(item => item.id !== action.payload.id)
                }
            }
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                )
            }
        case 'APPLY_DISCOUNT':
            return {
                ...state,
                discount: action.payload
            }
        case 'SET_SHIPPING':
            return {
                ...state,
                shipping: action.payload
            }
        case 'CLEAR_CART':
            return {
                ...state,
                items: [],
                discount: 0,
                shipping: 0
            }
        case 'CALCULATE_TAX': {
            const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            return {
                ...state,
                tax: subtotal * 0.08 // 8% tax
            }
        }
        default:
            return state
    }
}

// Form Reducer
interface FormState {
    values: Record<string, string>
    errors: Record<string, string>
    touched: Record<string, boolean>
    isSubmitting: boolean
    isValid: boolean
}

type FormAction =
    | { type: 'SET_FIELD'; payload: { field: string; value: string } }
    | { type: 'SET_ERROR'; payload: { field: string; error: string } }
    | { type: 'CLEAR_ERROR'; payload: string }
    | { type: 'TOUCH_FIELD'; payload: string }
    | { type: 'SET_SUBMITTING'; payload: boolean }
    | { type: 'VALIDATE_FORM' }
    | { type: 'RESET_FORM' }

const formReducer = (state: FormState, action: FormAction): FormState => {
    switch (action.type) {
        case 'SET_FIELD':
            return {
                ...state,
                values: { ...state.values, [action.payload.field]: action.payload.value }
            }
        case 'SET_ERROR':
            return {
                ...state,
                errors: { ...state.errors, [action.payload.field]: action.payload.error }
            }
        case 'CLEAR_ERROR': {
            const {[action.payload]: _, ...restErrors} = state.errors
            return {
                ...state,
                errors: restErrors
            }
        }
        case 'TOUCH_FIELD':
            return {
                ...state,
                touched: { ...state.touched, [action.payload]: true }
            }
        case 'SET_SUBMITTING':
            return {
                ...state,
                isSubmitting: action.payload
            }
        case 'VALIDATE_FORM': {
            const errors: Record<string, string> = {}

            if (!state.values.name) errors.name = 'Name is required'
            if (!state.values.email) errors.email = 'Email is required'
            else if (!/\S+@\S+\.\S+/.test(state.values.email)) errors.email = 'Email is invalid'
            if (!state.values.phone) errors.phone = 'Phone is required'

            return {
                ...state,
                errors,
                isValid: Object.keys(errors).length === 0
            }
        }
        case 'RESET_FORM':
            return {
                values: {},
                errors: {},
                touched: {},
                isSubmitting: false,
                isValid: false
            }
        default:
            return state
    }
}

export function UseReducerDemo() {
    // Counter with useReducer
    const [counterState, counterDispatch] = useReducer(counterReducer, { count: 0, step: 1 })

    // Timer with useReducer
    const [timerState, timerDispatch] = useReducer(timerReducer, {
        seconds: 0,
        isRunning: false,
        interval: 1000
    })

    // Todo list with useReducer
    const [todoState, todoDispatch] = useReducer(todoReducer, {
        todos: [
            { id: '1', text: 'Learn useReducer', completed: false, priority: 'high' },
            { id: '2', text: 'Build todo app', completed: true, priority: 'medium' }
        ],
        filter: 'all',
        editingId: null
    })

    // Shopping cart with useReducer
    const [cartState, cartDispatch] = useReducer(cartReducer, {
        items: [],
        discount: 0,
        shipping: 0,
        tax: 0
    })

    // Form with useReducer
    const [formState, formDispatch] = useReducer(formReducer, {
        values: {},
        errors: {},
        touched: {},
        isSubmitting: false,
        isValid: false
    })

    const [newTodo, setNewTodo] = useState('')
    const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [editText, setEditText] = useState('')

    // Timer effect
    const { seconds, isRunning } = timerState

    // Use useEffect to handle timer ticking
    useState(() => {
        if (isRunning) {
            const interval = setInterval(() => {
                timerDispatch({ type: 'TICK' })
            }, 1000)
            return () => clearInterval(interval)
        }
    })

    // Helper functions
    const addTodo = () => {
        if (newTodo.trim()) {
            todoDispatch({ type: 'ADD_TODO', payload: { text: newTodo, priority: newTodoPriority } })
            setNewTodo('')
        }
    }

    const startEdit = (todo: Todo) => {
        todoDispatch({ type: 'EDIT_TODO', payload: todo.id })
        setEditText(todo.text)
    }

    const saveEdit = (id: string) => {
        todoDispatch({ type: 'UPDATE_TODO', payload: { id, text: editText } })
        setEditText('')
    }

    const products = [
        { id: '1', name: 'React Book', price: 29.99 },
        { id: '2', name: 'TypeScript Guide', price: 39.99 },
        { id: '3', name: 'JavaScript Course', price: 49.99 }
    ]

    const filteredTodos = todoState.todos.filter(todo => {
        if (todoState.filter === 'active') return !todo.completed
        if (todoState.filter === 'completed') return todo.completed
        return true
    })

    const cartTotal = cartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const discountAmount = cartTotal * (cartState.discount / 100)
    const finalTotal = cartTotal - discountAmount + cartState.shipping + cartState.tax

    const handleFormSubmit = async () => {
        formDispatch({ type: 'VALIDATE_FORM' })

        if (formState.isValid) {
            formDispatch({ type: 'SET_SUBMITTING', payload: true })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            formDispatch({ type: 'SET_SUBMITTING', payload: false })
            formDispatch({ type: 'RESET_FORM' })
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800'
            case 'medium': return 'bg-yellow-100 text-yellow-800'
            case 'low': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useReducer Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Manage complex state logic with actions and reducers
                </p>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Patterns</TabsTrigger>
                    <TabsTrigger value="complex">Complex State</TabsTrigger>
                    <TabsTrigger value="practical">Practical Examples</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Counter Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Counter</Badge>
                                Counter with Custom Step
                            </CardTitle>
                            <CardDescription>
                                Basic useReducer example with multiple action types
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center space-x-4">
                                    <Button
                                        onClick={() => counterDispatch({ type: 'DECREMENT' })}
                                        variant="outline"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <div className="text-center min-w-[100px]">
                                        <div className="text-4xl font-bold">{counterState.count}</div>
                                        <div className="text-sm text-muted-foreground">Step: {counterState.step}</div>
                                    </div>
                                    <Button
                                        onClick={() => counterDispatch({ type: 'INCREMENT' })}
                                        variant="outline"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex justify-center space-x-2">
                                    <Button
                                        onClick={() => counterDispatch({ type: 'RESET' })}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                    <Input
                                        type="number"
                                        placeholder="Step"
                                        value={counterState.step}
                                        onChange={(e) => counterDispatch({ type: 'SET_STEP', payload: parseInt(e.target.value) || 1 })}
                                        className="w-20"
                                    />
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const counterReducer = (state, action) => {\n  switch (action.type) {\n    case 'INCREMENT': return { ...state, count: state.count + state.step }\n    case 'DECREMENT': return { ...state, count: state.count - state.step }\n    case 'RESET': return { ...state, count: 0 }\n    default: return state\n  }\n}`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Timer Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                Timer with Actions
                            </CardTitle>
                            <CardDescription>
                                Timer state management with start/pause/stop actions
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-6xl font-mono font-bold">
                                        {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}
                                    </div>
                                    <div className="mt-4 flex justify-center space-x-2">
                                        <Button
                                            onClick={() => timerDispatch({ type: isRunning ? 'PAUSE' : 'START' })}
                                            variant={isRunning ? "destructive" : "default"}
                                        >
                                            {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                                            {isRunning ? 'Pause' : 'Start'}
                                        </Button>
                                        <Button
                                            onClick={() => timerDispatch({ type: 'STOP' })}
                                            variant="outline"
                                        >
                                            <Square className="h-4 w-4 mr-2" />
                                            Stop
                                        </Button>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`dispatch({ type: 'START' })\ndispatch({ type: 'PAUSE' })\ndispatch({ type: 'STOP' })`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="complex" className="space-y-6">
                    {/* Todo List */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Todo</Badge>
                                Todo List with Complex State
                            </CardTitle>
                            <CardDescription>
                                Managing arrays, editing state, and filtering with useReducer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Add Todo */}
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Add a new todo..."
                                        value={newTodo}
                                        onChange={(e) => setNewTodo(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                                    />
                                    <select
                                        value={newTodoPriority}
                                        onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
                                        className="px-3 py-2 border rounded"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                    <Button onClick={addTodo}>Add</Button>
                                </div>

                                {/* Filter Buttons */}
                                <div className="flex gap-2">
                                    {['all', 'active', 'completed'].map(filter => (
                                        <Button
                                            key={filter}
                                            onClick={() => todoDispatch({ type: 'SET_FILTER', payload: filter as any })}
                                            variant={todoState.filter === filter ? "default" : "outline"}
                                            size="sm"
                                        >
                                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </Button>
                                    ))}
                                    <Button
                                        onClick={() => todoDispatch({ type: 'CLEAR_COMPLETED' })}
                                        variant="outline"
                                        size="sm"
                                    >
                                        Clear Completed
                                    </Button>
                                </div>

                                {/* Todo List */}
                                <div className="space-y-2">
                                    {filteredTodos.map(todo => (
                                        <div key={todo.id} className="flex items-center gap-2 p-3 border rounded">
                                            <input
                                                type="checkbox"
                                                checked={todo.completed}
                                                onChange={() => todoDispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
                                                className="h-4 w-4"
                                            />

                                            {todoState.editingId === todo.id ? (
                                                <div className="flex-1 flex gap-2">
                                                    <Input
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                                                    />
                                                    <Button
                                                        onClick={() => saveEdit(todo.id)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => todoDispatch({ type: 'CANCEL_EDIT' })}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                          <span className={`flex-1 ${todo.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {todo.text}
                          </span>
                                                    <Badge className={getPriorityColor(todo.priority)}>
                                                        {todo.priority}
                                                    </Badge>
                                                    <select
                                                        value={todo.priority}
                                                        onChange={(e) => todoDispatch({
                                                            type: 'SET_PRIORITY',
                                                            payload: { id: todo.id, priority: e.target.value as 'low' | 'medium' | 'high' }
                                                        })}
                                                        className="px-2 py-1 border rounded text-xs"
                                                    >
                                                        <option value="low">Low</option>
                                                        <option value="medium">Medium</option>
                                                        <option value="high">High</option>
                                                    </select>
                                                    <Button
                                                        onClick={() => startEdit(todo)}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => todoDispatch({ type: 'DELETE_TODO', payload: todo.id })}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {filteredTodos.length} items • {todoState.todos.filter(t => !t.completed).length} active
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="practical" className="space-y-6">
                    {/* Shopping Cart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">E-commerce</Badge>
                                Shopping Cart
                            </CardTitle>
                            <CardDescription>
                                Complex cart state with calculations and discounts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Products */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {products.map(product => (
                                        <div key={product.id} className="border rounded-lg p-4">
                                            <h4 className="font-medium">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">${product.price}</p>
                                            <Button
                                                onClick={() => cartDispatch({ type: 'ADD_ITEM', payload: product })}
                                                size="sm"
                                                className="mt-2 w-full"
                                            >
                                                <ShoppingCart className="h-4 w-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {/* Cart Items */}
                                {cartState.items.length > 0 && (
                                    <div className="border rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-medium">Cart Items</h4>
                                            <Button
                                                onClick={() => cartDispatch({ type: 'CLEAR_CART' })}
                                                variant="outline"
                                                size="sm"
                                            >
                                                Clear Cart
                                            </Button>
                                        </div>

                                        {cartState.items.map(item => (
                                            <div key={item.id} className="flex items-center justify-between p-2 border rounded mb-2">
                                                <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">${item.price} each</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        onClick={() => cartDispatch({
                                                            type: 'UPDATE_QUANTITY',
                                                            payload: { id: item.id, quantity: item.quantity - 1 }
                                                        })}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        onClick={() => cartDispatch({
                                                            type: 'UPDATE_QUANTITY',
                                                            payload: { id: item.id, quantity: item.quantity + 1 }
                                                        })}
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => cartDispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                                                        size="sm"
                                                        variant="destructive"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}

                                        {/* Cart Controls */}
                                        <div className="mt-4 space-y-2">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Discount %"
                                                    type="number"
                                                    onChange={(e) => cartDispatch({ type: 'APPLY_DISCOUNT', payload: parseInt(e.target.value) || 0 })}
                                                    className="w-32"
                                                />
                                                <Input
                                                    placeholder="Shipping"
                                                    type="number"
                                                    onChange={(e) => cartDispatch({ type: 'SET_SHIPPING', payload: parseFloat(e.target.value) || 0 })}
                                                    className="w-32"
                                                />
                                                <Button
                                                    onClick={() => cartDispatch({ type: 'CALCULATE_TAX' })}
                                                    variant="outline"
                                                    size="sm"
                                                >
                                                    Calculate Tax
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Cart Summary */}
                                        <div className="mt-4 pt-4 border-t space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>${cartTotal.toFixed(2)}</span>
                                            </div>
                                            {cartState.discount > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span>Discount ({cartState.discount}%):</span>
                                                    <span>-${discountAmount.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {cartState.shipping > 0 && (
                                                <div className="flex justify-between">
                                                    <span>Shipping:</span>
                                                    <span>${cartState.shipping.toFixed(2)}</span>
                                                </div>
                                            )}
                                            {cartState.tax > 0 && (
                                                <div className="flex justify-between">
                                                    <span>Tax:</span>
                                                    <span>${cartState.tax.toFixed(2)}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between font-bold text-lg border-t pt-2">
                                                <span>Total:</span>
                                                <span>${finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {/* Form with Validation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Form</Badge>
                                Form with Validation
                            </CardTitle>
                            <CardDescription>
                                Complex form state management with validation and submission
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Name</label>
                                        <Input
                                            value={formState.values.name || ''}
                                            onChange={(e) => {
                                                formDispatch({ type: 'SET_FIELD', payload: { field: 'name', value: e.target.value } })
                                                formDispatch({ type: 'CLEAR_ERROR', payload: 'name' })
                                            }}
                                            onBlur={() => formDispatch({ type: 'TOUCH_FIELD', payload: 'name' })}
                                            placeholder="Enter your name"
                                        />
                                        {formState.errors.name && formState.touched.name && (
                                            <p className="text-red-500 text-sm mt-1">{formState.errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Email</label>
                                        <Input
                                            type="email"
                                            value={formState.values.email || ''}
                                            onChange={(e) => {
                                                formDispatch({ type: 'SET_FIELD', payload: { field: 'email', value: e.target.value } })
                                                formDispatch({ type: 'CLEAR_ERROR', payload: 'email' })
                                            }}
                                            onBlur={() => formDispatch({ type: 'TOUCH_FIELD', payload: 'email' })}
                                            placeholder="Enter your email"
                                        />
                                        {formState.errors.email && formState.touched.email && (
                                            <p className="text-red-500 text-sm mt-1">{formState.errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Phone</label>
                                        <Input
                                            value={formState.values.phone || ''}
                                            onChange={(e) => {
                                                formDispatch({ type: 'SET_FIELD', payload: { field: 'phone', value: e.target.value } })
                                                formDispatch({ type: 'CLEAR_ERROR', payload: 'phone' })
                                            }}
                                            onBlur={() => formDispatch({ type: 'TOUCH_FIELD', payload: 'phone' })}
                                            placeholder="Enter your phone"
                                        />
                                        {formState.errors.phone && formState.touched.phone && (
                                            <p className="text-red-500 text-sm mt-1">{formState.errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleFormSubmit}
                                        disabled={formState.isSubmitting}
                                    >
                                        {formState.isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="h-4 w-4 mr-2" />
                                                Submit
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        onClick={() => formDispatch({ type: 'RESET_FORM' })}
                                        variant="outline"
                                    >
                                        Reset
                                    </Button>

                                    <Button
                                        onClick={() => formDispatch({ type: 'VALIDATE_FORM' })}
                                        variant="outline"
                                    >
                                        Validate
                                    </Button>
                                </div>

                                {/* Form State Debug */}
                                <div className="p-3 bg-muted rounded-lg">
                                    <h4 className="font-medium mb-2">Form State:</h4>
                                    <code className="text-sm">
                                        {JSON.stringify({
                                            isValid: formState.isValid,
                                            isSubmitting: formState.isSubmitting,
                                            errorCount: Object.keys(formState.errors).length,
                                            touchedFields: Object.keys(formState.touched).length
                                        }, null, 2)}
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
                            <h4 className="font-medium">⚡ Pure Functions</h4>
                            <p className="text-sm text-muted-foreground">
                                Reducers must be pure functions that return new state based on current state and action.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎯 Action Types</h4>
                            <p className="text-sm text-muted-foreground">
                                Use descriptive action types and payloads to make state changes predictable.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 Immutability</h4>
                            <p className="text-sm text-muted-foreground">
                                Always return new state objects, never mutate existing state directly.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🏗️ Complex State</h4>
                            <p className="text-sm text-muted-foreground">
                                useReducer is ideal for complex state logic with multiple sub-values or dependencies.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}