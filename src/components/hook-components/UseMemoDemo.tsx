import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    Search,
    TrendingUp,
    BarChart3,
    AlertTriangle,
    CheckCircle,
    Target,
    Layers,
    Cpu,
    RefreshCw
} from 'lucide-react'
import * as React from "react";

interface Product {
    id: number
    name: string
    price: number
    category: string
    rating: number
    inStock: boolean
    description: string
}

interface DataPoint {
    x: number
    y: number
    label: string
}

interface User {
    id: number
    name: string
    email: string
    department: string
    salary: number
    joinDate: string
    isActive: boolean
}

// Expensive computation function
const expensiveCalculation = (num: number): number => {
    console.log('🔥 Expensive calculation running for:', num)
    let result = 0
    for (let i = 0; i < num * 100000; i++) {
        result += Math.sqrt(i)
    }
    return result
}

// Expensive fibonacci calculation
const fibonacci = (n: number): number => {
    console.log('🔥 Fibonacci calculation for:', n)
    if (n <= 1) return n
    return fibonacci(n - 1) + fibonacci(n - 2)
}

// Expensive prime calculation
const isPrime = (num: number): boolean => {
    console.log('🔥 Prime check for:', num)
    if (num < 2) return false
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false
    }
    return true
}

// Expensive data processing
const processLargeDataset = (data: DataPoint[]): { mean: number; median: number; mode: number; std: number } => {
    console.log('🔥 Processing large dataset with', data.length, 'points')

    const values = data.map(d => d.y).sort((a, b) => a - b)
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length
    const median = values.length % 2 === 0
        ? (values[values.length / 2 - 1] + values[values.length / 2]) / 2
        : values[Math.floor(values.length / 2)]

    // Calculate mode
    const frequency: { [key: number]: number } = {}
    values.forEach(val => frequency[val] = (frequency[val] || 0) + 1)
    const mode = Object.keys(frequency).reduce((a, b) => frequency[Number(a)] > frequency[Number(b)] ? a : b)

    // Calculate standard deviation
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)

    return { mean, median, mode: Number(mode), std }
}

// Complex sorting algorithm
const complexSort = (items: Product[], sortBy: string, direction: 'asc' | 'desc'): Product[] => {
    console.log('🔥 Complex sorting for', items.length, 'items by', sortBy, direction)

    return [...items].sort((a, b) => {
        let aVal: string | number | boolean = a[sortBy as keyof Product]
        let bVal: string | number | boolean = b[sortBy as keyof Product]

        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase()
            bVal = (bVal as string).toLowerCase()
        }

        if (direction === 'asc') {
            return aVal > bVal ? 1 : -1
        } else {
            return aVal < bVal ? 1 : -1
        }
    })
}

// Performance tracker component
const PerformanceTracker = ({ label, children }: { label: string; children: React.ReactNode }) => {
    const renderCount = useRef(0)
    const startTime = useRef(performance.now())

    renderCount.current++

    useEffect(() => {
        const endTime = performance.now()
        console.log(`⏱️ ${label} render #${renderCount.current} took ${endTime - startTime.current}ms`)
        startTime.current = endTime
    })

    return (
        <div className="relative">
            <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                Renders: {renderCount.current}
            </div>
            {children}
        </div>
    )
}

// Expensive list component
const ExpensiveList = ({ items, filter }: { items: Product[]; filter: string }) => {
    const renderCount = useRef(0)
    renderCount.current++

    // Without useMemo - this would recalculate every time
    const filteredItems = useMemo(() => {
        console.log('🔥 Filtering items for:', filter)
        return items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase()) ||
            item.category.toLowerCase().includes(filter.toLowerCase())
        )
    }, [items, filter])

    // Expensive statistics calculation
    const statistics = useMemo(() => {
        console.log('🔥 Calculating statistics for filtered items')
        const avgPrice = filteredItems.reduce((sum, item) => sum + item.price, 0) / filteredItems.length
        const totalValue = filteredItems.reduce((sum, item) => sum + item.price, 0)
        const inStockCount = filteredItems.filter(item => item.inStock).length

        return {
            avgPrice: avgPrice || 0,
            totalValue,
            inStockCount,
            categories: [...new Set(filteredItems.map(item => item.category))].length
        }
    }, [filteredItems])

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Product List</h3>
                <Badge variant="outline">Renders: {renderCount.current}</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                    <div className="text-2xl font-bold">${statistics.avgPrice.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Avg Price</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">${statistics.totalValue.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{statistics.inStockCount}</div>
                    <div className="text-sm text-muted-foreground">In Stock</div>
                </div>
                <div className="text-center">
                    <div className="text-2xl font-bold">{statistics.categories}</div>
                    <div className="text-sm text-muted-foreground">Categories</div>
                </div>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
                {filteredItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.category}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-medium">${item.price}</div>
                            <div className={`text-sm ${item.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    No items found matching "{filter}"
                </div>
            )}
        </div>
    )
}

export function UseMemoDemo() {
    // Example 1: Basic expensive calculation
    const [number, setNumber] = useState(100)
    const [multiplier, setMultiplier] = useState(1)
    const [theme, setTheme] = useState('light')

    // Without useMemo - would recalculate on every render
    const expensiveResult = useMemo(() => {
        return expensiveCalculation(number)
    }, [number])

    // Example 2: Fibonacci calculation
    const [fibNumber, setFibNumber] = useState(10)
    const [fibColor, setFibColor] = useState('blue')

    const fibResult = useMemo(() => {
        return fibonacci(fibNumber)
    }, [fibNumber])

    // Example 3: Prime number checking
    const [primeNumber, setPrimeNumber] = useState(97)
    const [primeCount, setPrimeCount] = useState(0)

    const primeResult = useMemo(() => {
        return isPrime(primeNumber)
    }, [primeNumber])

    // Example 4: Complex data processing
    const [dataSize, setDataSize] = useState(1000)

    const generateDataset = useCallback(() => {
        console.log('🔥 Generating large dataset with', dataSize, 'points')
        return Array.from({ length: dataSize }, (_, i) => ({
            x: i,
            y: Math.random() * 100,
            label: `Point ${i}`
        }))
    }, [dataSize])

    const [largeDataset, setLargeDataset] = useState(() => generateDataset())

    // Update dataset when dataSize changes
    useEffect(() => {
        setLargeDataset(generateDataset())
    }, [generateDataset])

    const dataStatistics = useMemo(() => {
        return processLargeDataset(largeDataset)
    }, [largeDataset])

    // Example 5: Product filtering and sorting
    const [products] = useState<Product[]>([
        { id: 1, name: 'MacBook Pro', price: 1999, category: 'Electronics', rating: 4.8, inStock: true, description: 'High-performance laptop' },
        { id: 2, name: 'iPhone 14', price: 799, category: 'Electronics', rating: 4.6, inStock: true, description: 'Latest smartphone' },
        { id: 3, name: 'Air Jordan 1', price: 150, category: 'Shoes', rating: 4.9, inStock: false, description: 'Classic basketball shoes' },
        { id: 4, name: 'Coffee Maker', price: 89, category: 'Home', rating: 4.3, inStock: true, description: 'Automatic coffee maker' },
        { id: 5, name: 'Desk Chair', price: 299, category: 'Furniture', rating: 4.2, inStock: true, description: 'Ergonomic office chair' },
        { id: 6, name: 'Tablet', price: 329, category: 'Electronics', rating: 4.4, inStock: true, description: 'Portable tablet device' },
        { id: 7, name: 'Running Shoes', price: 120, category: 'Shoes', rating: 4.5, inStock: true, description: 'Comfortable running shoes' },
        { id: 8, name: 'Blender', price: 79, category: 'Home', rating: 4.1, inStock: false, description: 'High-speed blender' },
        { id: 9, name: 'Bookshelf', price: 199, category: 'Furniture', rating: 4.0, inStock: true, description: 'Wooden bookshelf' },
        { id: 10, name: 'Headphones', price: 199, category: 'Electronics', rating: 4.7, inStock: true, description: 'Noise-cancelling headphones' }
    ])

    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: 2000 })

    // Filtered products with useMemo
    const filteredProducts = useMemo(() => {
        console.log('🔥 Filtering products by search term and price')
        return products.filter(product =>
            (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
            product.price >= priceFilter.min &&
            product.price <= priceFilter.max
        )
    }, [products, searchTerm, priceFilter])

    // Sorted products with useMemo
    const sortedProducts = useMemo(() => {
        return complexSort(filteredProducts, sortBy, sortDirection)
    }, [filteredProducts, sortBy, sortDirection])

    // Example 6: Search suggestions
    const [searchQuery, setSearchQuery] = useState('')

    const searchSuggestions = useMemo(() => {
        if (!searchQuery) return []

        console.log('🔥 Generating search suggestions for:', searchQuery)
        const suggestions = [
            'React Hooks Tutorial',
            'JavaScript Fundamentals',
            'TypeScript Guide',
            'Node.js Backend',
            'MongoDB Database',
            'Express.js Framework',
            'CSS Grid Layout',
            'Responsive Design',
            'Performance Optimization',
            'Testing Best Practices'
        ]

        return suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5)
    }, [searchQuery])

    // Example 7: User analytics
    const [users] = useState<User[]>(() => {
        return Array.from({ length: 1000 }, (_, i) => ({
            id: i + 1,
            name: `User ${i + 1}`,
            email: `user${i + 1}@example.com`,
            department: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'][i % 5],
            salary: 40000 + (i * 1000),
            joinDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toISOString().split('T')[0],
            isActive: i % 10 !== 0
        }))
    })

    const [selectedDepartment, setSelectedDepartment] = useState('All')
    const [salaryRange, setSalaryRange] = useState({ min: 40000, max: 100000 })

    const userAnalytics = useMemo(() => {
        console.log('🔥 Calculating user analytics')

        const filteredUsers = users.filter(user =>
            (selectedDepartment === 'All' || user.department === selectedDepartment) &&
            user.salary >= salaryRange.min &&
            user.salary <= salaryRange.max
        )

        const departmentStats = filteredUsers.reduce((acc, user) => {
            acc[user.department] = (acc[user.department] || 0) + 1
            return acc
        }, {} as { [key: string]: number })

        const avgSalary = filteredUsers.reduce((sum, user) => sum + user.salary, 0) / filteredUsers.length
        const activeUsers = filteredUsers.filter(user => user.isActive).length

        return {
            total: filteredUsers.length,
            active: activeUsers,
            avgSalary: avgSalary || 0,
            departmentStats,
            salaryDistribution: {
                low: filteredUsers.filter(user => user.salary < 50000).length,
                medium: filteredUsers.filter(user => user.salary >= 50000 && user.salary < 80000).length,
                high: filteredUsers.filter(user => user.salary >= 80000).length
            }
        }
    }, [users, selectedDepartment, salaryRange])

    // Performance metrics
    const renderCountRef = useRef(0)
    renderCountRef.current += 1

    const renderCount = renderCountRef.current

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useMemo Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Optimize performance by memoizing expensive calculations and complex computations
                </p>
            </div>

            {/* Performance Metrics */}
            <Alert>
                <Cpu className="h-4 w-4" />
                <AlertDescription>
                    Component renders: <strong>{renderCount}</strong> |
                    Check console for computation logs and performance metrics
                </AlertDescription>
            </Alert>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Memoization</TabsTrigger>
                    <TabsTrigger value="complex">Complex Calculations</TabsTrigger>
                    <TabsTrigger value="filtering">Data Filtering</TabsTrigger>
                    <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Basic Expensive Calculation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Calculation</Badge>
                                Expensive Mathematical Operation
                            </CardTitle>
                            <CardDescription>
                                Heavy computation that only runs when dependencies change
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <PerformanceTracker label="Expensive Calculation">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="text-sm font-medium">Number (affects calculation)</label>
                                            <Input
                                                type="number"
                                                value={number}
                                                onChange={(e) => setNumber(parseInt(e.target.value) || 0)}
                                                min="1"
                                                max="1000"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Multiplier (doesn't affect calculation)</label>
                                            <Input
                                                type="number"
                                                value={multiplier}
                                                onChange={(e) => setMultiplier(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">Theme (doesn't affect calculation)</label>
                                            <select
                                                value={theme}
                                                onChange={(e) => setTheme(e.target.value)}
                                                className="w-full px-3 py-2 border rounded"
                                            >
                                                <option value="light">Light</option>
                                                <option value="dark">Dark</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="text-center py-8">
                                        <div className="text-4xl font-bold text-blue-600">
                                            {expensiveResult.toFixed(2)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Calculation result for {number}
                                        </div>
                                    </div>
                                </PerformanceTracker>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const expensiveResult = useMemo(() => {
                                              return expensiveCalculation(number)
                                            }, [number]) // Only recalculates when 'number' changes`}
                                    </code>
                                </div>

                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        Try changing the multiplier or theme - the expensive calculation won't run again!
                                        Only changing the number will trigger recalculation.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fibonacci Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Fibonacci</Badge>
                                Recursive Calculation
                            </CardTitle>
                            <CardDescription>
                                Recursive Fibonacci calculation with memoization
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Fibonacci Number (affects calculation)</label>
                                        <Input
                                            type="number"
                                            value={fibNumber}
                                            onChange={(e) => setFibNumber(Math.min(35, parseInt(e.target.value) || 0))}
                                            min="0"
                                            max="35"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Limited to 35 to prevent browser freeze
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Color (doesn't affect calculation)</label>
                                        <select
                                            value={fibColor}
                                            onChange={(e) => setFibColor(e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="blue">Blue</option>
                                            <option value="green">Green</option>
                                            <option value="red">Red</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="text-center py-8">
                                    <div className={`text-4xl font-bold text-${fibColor}-600`}>
                                        {fibResult}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Fibonacci({fibNumber}) = {fibResult}
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const fibResult = useMemo(() => {
                                              return fibonacci(fibNumber)
                                            }, [fibNumber]) // Expensive recursive calculation`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Prime Number Check */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Prime</Badge>
                                Prime Number Validation
                            </CardTitle>
                            <CardDescription>
                                Check if a number is prime with memoized calculation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Number to Check</label>
                                        <Input
                                            type="number"
                                            value={primeNumber}
                                            onChange={(e) => setPrimeNumber(parseInt(e.target.value) || 0)}
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Counter (doesn't affect calculation)</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                value={primeCount}
                                                onChange={(e) => setPrimeCount(parseInt(e.target.value) || 0)}
                                            />
                                            <Button
                                                onClick={() => setPrimeCount(prev => prev + 1)}
                                                variant="outline"
                                            >
                                                +1
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center py-8">
                                    <div className="flex items-center justify-center gap-2">
                                        {primeResult ? (
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        ) : (
                                            <AlertTriangle className="h-8 w-8 text-red-600" />
                                        )}
                                        <div className="text-2xl font-bold">
                                            {primeNumber} is {primeResult ? 'prime' : 'not prime'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const primeResult = useMemo(() => {
                                              return isPrime(primeNumber)
                                            }, [primeNumber]) // Only recalculates when number changes`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="complex" className="space-y-6">
                    {/* Data Processing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Analytics</Badge>
                                Large Dataset Processing
                            </CardTitle>
                            <CardDescription>
                                Statistical analysis of large datasets with memoization
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Dataset Size</label>
                                        <Input
                                            type="number"
                                            value={dataSize}
                                            onChange={(e) => setDataSize(parseInt(e.target.value) || 1000)}
                                            min="100"
                                            max="10000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Refresh Data</label>
                                        <Button
                                            onClick={() => setLargeDataset(generateDataset())}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-2" />
                                            Regenerate Dataset
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded">
                                        <BarChart3 className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                                        <div className="text-2xl font-bold">{dataStatistics.mean.toFixed(2)}</div>
                                        <div className="text-sm text-muted-foreground">Mean</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <Target className="h-6 w-6 mx-auto mb-2 text-green-600" />
                                        <div className="text-2xl font-bold">{dataStatistics.median.toFixed(2)}</div>
                                        <div className="text-sm text-muted-foreground">Median</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                                        <div className="text-2xl font-bold">{dataStatistics.mode}</div>
                                        <div className="text-sm text-muted-foreground">Mode</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <Layers className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                                        <div className="text-2xl font-bold">{dataStatistics.std.toFixed(2)}</div>
                                        <div className="text-sm text-muted-foreground">Std Dev</div>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const dataStatistics = useMemo(() => {
                                              return processLargeDataset(largeDataset)
                                            }, [largeDataset]) // Only recalculates when dataset changes`}
                                    </code>
                                </div>

                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Processing {dataSize} data points. Statistics are memoized and only recalculate when the dataset changes.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Search Suggestions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Search</Badge>
                                Search Suggestions
                            </CardTitle>
                            <CardDescription>
                                Dynamic search suggestions with memoized filtering
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">Search Query</label>
                                    <Input
                                        placeholder="Type to search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {searchSuggestions.length > 0 && (
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">
                                            Found {searchSuggestions.length} suggestions:
                                        </p>
                                        {searchSuggestions.map((suggestion, index) => (
                                            <div key={index} className="p-2 border rounded flex items-center gap-2">
                                                <Search className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm">{suggestion}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const searchSuggestions = useMemo(() => {
                                              return suggestions.filter(suggestion =>
                                                suggestion.toLowerCase().includes(searchQuery.toLowerCase())
                                              )
                                            }, [searchQuery]) // Only filters when search query changes`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="filtering" className="space-y-6">
                    {/* Product Filtering */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">E-commerce</Badge>
                                Product Filtering & Sorting
                            </CardTitle>
                            <CardDescription>
                                Complex product filtering with memoized results
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Search Products</label>
                                        <Input
                                            placeholder="Search by name or category..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="name">Name</option>
                                            <option value="price">Price</option>
                                            <option value="rating">Rating</option>
                                            <option value="category">Category</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Direction</label>
                                        <select
                                            value={sortDirection}
                                            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="asc">Ascending</option>
                                            <option value="desc">Descending</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Min Price: ${priceFilter.min}</label>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="50"
                                            value={priceFilter.min}
                                            onChange={(e) => setPriceFilter(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Max Price: ${priceFilter.max}</label>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="2000"
                                            step="50"
                                            value={priceFilter.max}
                                            onChange={(e) => setPriceFilter(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                                        />
                                    </div>
                                </div>

                                <ExpensiveList items={sortedProducts} filter={searchTerm} />

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const sortedProducts = useMemo(() => {
                                              return complexSort(filteredProducts, sortBy, sortDirection)
                                            }, [filteredProducts, sortBy, sortDirection])
                                            
                                            const filteredProducts = useMemo(() => {
                                              return products.filter(product => /* filtering logic */)
                                            }, [products, searchTerm, priceFilter])`}
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                    {/* User Analytics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Analytics</Badge>
                                User Analytics Dashboard
                            </CardTitle>
                            <CardDescription>
                                Complex analytics with memoized calculations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium">Department Filter</label>
                                        <select
                                            value={selectedDepartment}
                                            onChange={(e) => setSelectedDepartment(e.target.value)}
                                            className="w-full px-3 py-2 border rounded"
                                        >
                                            <option value="All">All Departments</option>
                                            <option value="Engineering">Engineering</option>
                                            <option value="Sales">Sales</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="HR">HR</option>
                                            <option value="Finance">Finance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium">Salary Range</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={salaryRange.min}
                                                onChange={(e) => setSalaryRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                                            />
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={salaryRange.max}
                                                onChange={(e) => setSalaryRange(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 border rounded">
                                        <div className="text-3xl font-bold text-blue-600">{userAnalytics.total}</div>
                                        <div className="text-sm text-muted-foreground">Total Users</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <div className="text-3xl font-bold text-green-600">{userAnalytics.active}</div>
                                        <div className="text-sm text-muted-foreground">Active Users</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <div className="text-3xl font-bold text-purple-600">${userAnalytics.avgSalary.toFixed(0)}</div>
                                        <div className="text-sm text-muted-foreground">Avg Salary</div>
                                    </div>
                                    <div className="text-center p-4 border rounded">
                                        <div className="text-3xl font-bold text-orange-600">
                                            {((userAnalytics.active / userAnalytics.total) * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">Active Rate</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 border rounded">
                                        <h4 className="font-medium mb-2">Department Distribution</h4>
                                        <div className="space-y-2">
                                            {Object.entries(userAnalytics.departmentStats).map(([dept, count]) => (
                                                <div key={dept} className="flex justify-between items-center">
                                                    <span className="text-sm">{dept}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${(count / userAnalytics.total) * 100}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-sm font-medium">{count}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 border rounded">
                                        <h4 className="font-medium mb-2">Salary Distribution</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Low (&lt;$50K)</span>
                                                <Badge variant="outline">{userAnalytics.salaryDistribution.low}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">Medium ($50K-$80K)</span>
                                                <Badge variant="outline">{userAnalytics.salaryDistribution.medium}</Badge>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm">High (&gt;$80K)</span>
                                                <Badge variant="outline">{userAnalytics.salaryDistribution.high}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        {`const userAnalytics = useMemo(() => {
                                              // Complex analytics calculations
                                              return {
                                                total, active, avgSalary, departmentStats, salaryDistribution
                                              }
                                            }, [users, selectedDepartment, salaryRange])`}
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
                                useMemo memoizes expensive calculations, preventing them from running on every render.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Performance</h4>
                            <p className="text-sm text-muted-foreground">
                                Most effective for computationally expensive operations, complex filtering, or large data processing.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔗 Dependencies</h4>
                            <p className="text-sm text-muted-foreground">
                                Only recalculates when dependencies in the dependency array change.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚠️ When to Use</h4>
                            <p className="text-sm text-muted-foreground">
                                Use for expensive calculations, complex object creation, or when referential equality matters.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}