import { useState, useContext, createContext, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    Sun,
    Moon,
    User,
    Settings,
    ShoppingCart,
    Plus,
    Minus,
    Globe,
    Volume2,
    VolumeX,
    Bell,
    BellOff,
    Eye,
    EyeOff
} from 'lucide-react'

// Theme Context
interface ThemeContextType {
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// User Context
interface User {
    id: string
    name: string
    email: string
    avatar: string
    role: 'admin' | 'user' | 'guest'
}

interface UserContextType {
    user: User | null
    login: (user: User) => void
    logout: () => void
    updateUser: (updates: Partial<User>) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

// Settings Context
interface Settings {
    language: 'en' | 'es' | 'fr'
    notifications: boolean
    soundEnabled: boolean
    autoSave: boolean
}

interface SettingsContextType {
    settings: Settings
    updateSettings: (updates: Partial<Settings>) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// Shopping Cart Context
interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Custom hooks for using contexts
const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

const useUser = () => {
    const context = useContext(UserContext)
    if (!context) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}

const useSettings = () => {
    const context = useContext(SettingsContext)
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}

const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

// Theme Provider Component
const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className={`${theme === 'dark' ? 'dark' : ''}`}>
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

// User Provider Component
const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)

    const login = (userData: User) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
    }

    const updateUser = (updates: Partial<User>) => {
        setUser(prev => prev ? { ...prev, ...updates } : null)
    }

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    )
}

// Settings Provider Component
const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [settings, setSettings] = useState<Settings>({
        language: 'en',
        notifications: true,
        soundEnabled: true,
        autoSave: false
    })

    const updateSettings = (updates: Partial<Settings>) => {
        setSettings(prev => ({ ...prev, ...updates }))
    }

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    )
}

// Cart Provider Component
const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<CartItem[]>([])

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === newItem.id)
            if (existing) {
                return prev.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            return [...prev, { ...newItem, quantity: 1 }]
        })
    }

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(id)
            return
        }
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity } : item
            )
        )
    }

    const clearCart = () => {
        setItems([])
    }

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

// Component that uses Theme Context
const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button onClick={toggleTheme} variant="outline" size="sm">
            {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </Button>
    )
}

// Component that uses User Context
const UserProfile = () => {
    const { user, login, logout, updateUser } = useUser()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')

    const handleLogin = () => {
        if (name && email) {
            login({
                id: '1',
                name,
                email,
                avatar: name.charAt(0).toUpperCase(),
                role: 'user'
            })
        }
    }

    if (!user) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        placeholder="Your email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleLogin} className="w-full">
                        <User className="h-4 w-4 mr-2" />
                        Login
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="mt-1">
                            {user.role}
                        </Badge>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUser({ role: user.role === 'admin' ? 'user' : 'admin' })}
                    >
                        Toggle Role
                    </Button>
                    <Button variant="outline" size="sm" onClick={logout}>
                        Logout
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

// Component that uses Settings Context
const SettingsPanel = () => {
    const { settings, updateSettings } = useSettings()

    return (
        <Card>
            <CardHeader>
                <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <Label>Language</Label>
                    </div>
                    <select
                        value={settings.language}
                        onChange={(e) => updateSettings({ language: e.target.value as 'en' | 'es' | 'fr' })}
                        className="px-3 py-1 border rounded"
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                    </select>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {settings.notifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
                        <Label>Notifications</Label>
                    </div>
                    <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {settings.soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                        <Label>Sound</Label>
                    </div>
                    <Switch
                        checked={settings.soundEnabled}
                        onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Settings className="h-4 w-4" />
                        <Label>Auto Save</Label>
                    </div>
                    <Switch
                        checked={settings.autoSave}
                        onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

// Component that uses Cart Context
const ShoppingCartDemo = () => {
    const { items, addItem, removeItem, updateQuantity, clearCart, total, itemCount } = useCart()

    const products = [
        { id: '1', name: 'React T-Shirt', price: 25 },
        { id: '2', name: 'TypeScript Mug', price: 15 },
        { id: '3', name: 'Next.js Sticker Pack', price: 8 }
    ]

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Cart ({itemCount} items)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {products.map(product => (
                            <div key={product.id} className="border rounded-lg p-4">
                                <h4 className="font-medium">{product.name}</h4>
                                <p className="text-sm text-muted-foreground">${product.price}</p>
                                <Button
                                    onClick={() => addItem(product)}
                                    size="sm"
                                    className="mt-2 w-full"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        ))}
                    </div>

                    {items.length > 0 && (
                        <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-medium">Cart Items</h4>
                                <Button onClick={clearCart} variant="outline" size="sm">
                                    Clear Cart
                                </Button>
                            </div>

                            <div className="space-y-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-muted-foreground">${item.price} each</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <Button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                onClick={() => removeItem(item.id)}
                                                size="sm"
                                                variant="destructive"
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Total:</span>
                                    <span className="font-bold text-lg">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Context Debug Panel
const ContextDebugPanel = () => {
    const { theme } = useTheme()
    const { user } = useUser()
    const { settings } = useSettings()
    const { items, total, itemCount } = useCart()

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Context Debug Panel
                </CardTitle>
                <CardDescription>
                    Real-time view of all context values
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">Theme Context</h4>
                        <div className="p-3 bg-muted rounded-lg">
                            <code className="text-sm">
                                {JSON.stringify({ theme }, null, 2)}
                            </code>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">User Context</h4>
                        <div className="p-3 bg-muted rounded-lg">
                            <code className="text-sm">
                                {JSON.stringify({ user }, null, 2)}
                            </code>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Settings Context</h4>
                        <div className="p-3 bg-muted rounded-lg">
                            <code className="text-sm">
                                {JSON.stringify(settings, null, 2)}
                            </code>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Cart Context</h4>
                        <div className="p-3 bg-muted rounded-lg">
                            <code className="text-sm">
                                {JSON.stringify({ itemCount, total, items }, null, 2)}
                            </code>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// Main Demo Component
const ContextDemoContent = () => {
    const [showDebug, setShowDebug] = useState(false)

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useContext Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Learn how to share state across components without prop drilling
                </p>
            </div>

            {/* Theme Toggle */}
            <div className="flex justify-between items-center">
                <ThemeToggle />
                <Button
                    onClick={() => setShowDebug(!showDebug)}
                    variant="outline"
                    size="sm"
                >
                    {showDebug ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                    {showDebug ? 'Hide' : 'Show'} Debug Panel
                </Button>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                    <TabsTrigger value="multiple">Multiple Contexts</TabsTrigger>
                    <TabsTrigger value="practical">Practical Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Context</Badge>
                                Theme Context Example
                            </CardTitle>
                            <CardDescription>
                                Simple theme context that can be accessed by any child component
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg">
                                    <p className="text-sm">
                                        Current theme: <strong>{useTheme().theme}</strong>
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        This component can access the theme without receiving it as a prop!
                                    </p>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const ThemeContext = createContext()\n\nconst useTheme = () => {\n  const context = useContext(ThemeContext)\n  if (!context) throw new Error('useTheme must be used within ThemeProvider')\n  return context\n}`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="multiple" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UserProfile />
                        <SettingsPanel />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Multiple Context Pattern</CardTitle>
                            <CardDescription>
                                Using multiple contexts together in a single application
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    {`<ThemeProvider>\n  <UserProvider>\n    <SettingsProvider>\n      <App />\n    </SettingsProvider>\n  </UserProvider>\n</ThemeProvider>`}
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="practical" className="space-y-6">
                    <ShoppingCartDemo />

                    <Card>
                        <CardHeader>
                            <CardTitle>Context Best Practices</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h4 className="font-medium">✅ Do</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Use context for truly global state</li>
                                        <li>• Create custom hooks for context access</li>
                                        <li>• Split contexts by concern</li>
                                        <li>• Provide error boundaries</li>
                                    </ul>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-medium">❌ Don't</h4>
                                    <ul className="text-sm text-muted-foreground space-y-1">
                                        <li>• Use context for all state</li>
                                        <li>• Put everything in one context</li>
                                        <li>• Forget to check for undefined</li>
                                        <li>• Use context for frequent updates</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Debug Panel */}
            {showDebug && <ContextDebugPanel />}

            {/* Key Concepts */}
            <Card>
                <CardHeader>
                    <CardTitle>Key Concepts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">🌳 Provider Pattern</h4>
                            <p className="text-sm text-muted-foreground">
                                Wrap components with providers to share state down the component tree.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎯 Custom Hooks</h4>
                            <p className="text-sm text-muted-foreground">
                                Create custom hooks to encapsulate context logic and error handling.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Performance</h4>
                            <p className="text-sm text-muted-foreground">
                                Context updates cause all consumers to re-render. Split contexts when needed.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🚫 Prop Drilling</h4>
                            <p className="text-sm text-muted-foreground">
                                Context eliminates the need to pass props through intermediate components.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// Main export with all providers
export function UseContextDemo() {
    return (
        <ThemeProvider>
            <UserProvider>
                <SettingsProvider>
                    <CartProvider>
                        <ContextDemoContent />
                    </CartProvider>
                </SettingsProvider>
            </UserProvider>
        </ThemeProvider>
    )
}