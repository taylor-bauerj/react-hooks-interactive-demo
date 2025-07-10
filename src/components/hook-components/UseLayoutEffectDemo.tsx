import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
    Zap, 
    Eye, 
    Ruler,
    Move,
    RotateCcw,
    Play,
    Pause,
    Layout,
    Timer,
    Layers,
    Target
} from 'lucide-react'

// Example 1: Visual Flash Comparison
const FlashComparison = () => {
    const [count, setCount] = useState(0);
    const [useLayout, setUseLayout] = useState(false);
    const divRef = useRef<HTMLDivElement>(null);

    // This will cause a flash with useEffect
    useEffect(() => {
        if (!useLayout && divRef.current) {
            if (count > 0) {
                divRef.current.style.backgroundColor = count % 2 === 0 ? '#ef4444' : '#10b981';
                divRef.current.style.transform = `scale(${1 + (count % 3) * 0.1})`;
            }
        }
    }, [count, useLayout]);

    // This will NOT cause a flash with useLayoutEffect
    useLayoutEffect(() => {
        if (useLayout && divRef.current) {
            if (count > 0) {
                divRef.current.style.backgroundColor = count % 2 === 0 ? '#ef4444' : '#10b981';
                divRef.current.style.transform = `scale(${1 + (count % 3) * 0.1})`;
            }
        }
    }, [count, useLayout]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Label>
                    <input
                        type="checkbox"
                        checked={useLayout}
                        onChange={(e) => setUseLayout(e.target.checked)}
                        className="mr-2"
                    />
                    Use useLayoutEffect (no flash)
                </Label>
                <Button onClick={() => setCount(c => c + 1)} size="sm">
                    Trigger Change ({count})
                </Button>
                <Button onClick={() => setCount(0)} size="sm" variant="outline">
                    Reset
                </Button>
            </div>
            
            <div
                ref={divRef}
                className="w-32 h-32 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold transition-none"
            >
                {count}
            </div>
            
            <div className="text-sm text-muted-foreground">
                {useLayout ? 'Using useLayoutEffect' : 'Using useEffect'} - 
                {count > 0 ? ' Watch for visual flashing!' : ' Click trigger to see the difference'}
            </div>
        </div>
    );
};

// Example 2: DOM Measurements
const DOMeasurements = () => {
    const [text, setText] = useState('Hello World');
    const [measurements, setMeasurements] = useState<{
        width: number;
        height: number;
        scrollWidth: number;
        scrollHeight: number;
    }>({ width: 0, height: 0, scrollWidth: 0, scrollHeight: 0 });
    const textRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (textRef.current) {
            const rect = textRef.current.getBoundingClientRect();
            setMeasurements({
                width: rect.width,
                height: rect.height,
                scrollWidth: textRef.current.scrollWidth,
                scrollHeight: textRef.current.scrollHeight
            });
        }
    }, [text]);

    return (
        <div className="space-y-4">
            <div>
                <Label htmlFor="text-input">Text Content:</Label>
                <Input
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type to see measurements update..."
                />
            </div>
            
            <div
                ref={textRef}
                className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 font-mono text-lg"
                style={{ wordBreak: 'break-word' }}
            >
                {text}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Width:</span>
                        <span className="font-mono">{measurements.width.toFixed(2)}px</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Height:</span>
                        <span className="font-mono">{measurements.height.toFixed(2)}px</span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span>Scroll Width:</span>
                        <span className="font-mono">{measurements.scrollWidth}px</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Scroll Height:</span>
                        <span className="font-mono">{measurements.scrollHeight}px</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Example 3: Tooltip Positioning
const TooltipPositioning = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [tooltipText, setTooltipText] = useState('Hover over the button');
    const buttonRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (showTooltip && buttonRef.current && tooltipRef.current) {
            const buttonRect = buttonRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            
            let x = buttonRect.left + buttonRect.width / 2 - tooltipRect.width / 2;
            let y = buttonRect.top - tooltipRect.height - 8;
            
            // Adjust if tooltip goes off screen
            if (x < 0) x = 8;
            if (x + tooltipRect.width > window.innerWidth) {
                x = window.innerWidth - tooltipRect.width - 8;
            }
            if (y < 0) {
                y = buttonRect.bottom + 8;
            }
            
            setTooltipPosition({ x, y });
        }
    }, [showTooltip, tooltipText]);

    return (
        <div className="space-y-4">
            <div className="flex gap-4 items-center">
                <Button
                    ref={buttonRef}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    variant="outline"
                >
                    Hover me for tooltip
                </Button>
                <Input
                    value={tooltipText}
                    onChange={(e) => setTooltipText(e.target.value)}
                    placeholder="Tooltip content..."
                    className="flex-1"
                />
            </div>
            
            {showTooltip && (
                <div
                    ref={tooltipRef}
                    className="fixed bg-gray-900 text-white px-3 py-2 rounded-lg text-sm z-50 pointer-events-none"
                    style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                    }}
                >
                    {tooltipText}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
            )}
            
            <div className="text-sm text-muted-foreground">
                Tooltip position: x={tooltipPosition.x.toFixed(0)}, y={tooltipPosition.y.toFixed(0)}
            </div>
        </div>
    );
};

// Example 4: Scroll Position Synchronization
const ScrollSync = () => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const indicatorRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const indicator = indicatorRef.current;
        
        if (!container || !indicator) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const percentage = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
            
            setScrollPosition(percentage);
            setIsScrolling(true);
            
            // Update indicator position immediately
            indicator.style.transform = `translateY(${(percentage / 100) * (container.clientHeight - 20)}px)`;
        };

        container.addEventListener('scroll', handleScroll);
        
        // Reset scrolling state
        const timer = setTimeout(() => setIsScrolling(false), 150);
        
        return () => {
            container.removeEventListener('scroll', handleScroll);
            clearTimeout(timer);
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="flex-1">
                    <Label>Scroll Position: {scrollPosition.toFixed(1)}%</Label>
                    <Progress value={scrollPosition} className="mt-2" />
                </div>
                <div className={`px-3 py-1 rounded-full text-xs ${
                    isScrolling ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                    {isScrolling ? 'Scrolling' : 'Idle'}
                </div>
            </div>
            
            <div className="relative">
                <div
                    ref={containerRef}
                    className="h-48 overflow-y-auto border rounded-lg p-4 bg-gray-50"
                >
                    <div className="space-y-4">
                        {Array.from({ length: 20 }, (_, i) => (
                            <div
                                key={i}
                                className={`h-16 rounded-lg flex items-center justify-center text-white font-bold ${
                                    i % 3 === 0 ? 'bg-blue-500' : 
                                    i % 3 === 1 ? 'bg-green-500' : 'bg-purple-500'
                                }`}
                            >
                                Item {i + 1}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div
                    ref={indicatorRef}
                    className="absolute right-2 top-2 w-3 h-5 bg-red-500 rounded-full transition-none"
                    style={{ transform: 'translateY(0px)' }}
                />
            </div>
        </div>
    );
};

// Example 5: Animation Synchronization
const AnimationSync = () => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationProgress, setAnimationProgress] = useState(0);
    const boxRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!isAnimating) return;

        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            setAnimationProgress(progress * 100);
            
            if (boxRef.current && progressRef.current) {
                // Synchronize animations
                const rotation = progress * 360;
                const scale = 1 + Math.sin(progress * Math.PI) * 0.5;
                
                boxRef.current.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                progressRef.current.style.width = `${progress * 100}%`;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setIsAnimating(false);
            }
        };
        
        requestAnimationFrame(animate);
    }, [isAnimating]);

    const resetAnimation = () => {
        setAnimationProgress(0);
        setIsAnimating(false);
        if (boxRef.current && progressRef.current) {
            boxRef.current.style.transform = 'rotate(0deg) scale(1)';
            progressRef.current.style.width = '0%';
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button
                    onClick={() => setIsAnimating(!isAnimating)}
                    disabled={isAnimating}
                    size="sm"
                >
                    {isAnimating ? (
                        <>
                            <Pause className="h-4 w-4 mr-2" />
                            Animating...
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Animation
                        </>
                    )}
                </Button>
                <Button onClick={resetAnimation} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                </Button>
            </div>
            
            <div className="flex items-center justify-center h-32">
                <div
                    ref={boxRef}
                    className="w-16 h-16 bg-blue-500 rounded-lg"
                    style={{ transform: 'rotate(0deg) scale(1)' }}
                />
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>Animation Progress:</span>
                    <span className="font-mono">{animationProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        ref={progressRef}
                        className="bg-blue-500 h-2 rounded-full transition-none"
                        style={{ width: '0%' }}
                    />
                </div>
            </div>
        </div>
    );
};

// Example 6: Dynamic Layout Adjustments
const DynamicLayout = () => {
    const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);
    const [containerWidth, setContainerWidth] = useState(0);
    const [itemsPerRow, setItemsPerRow] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            const width = containerRef.current.offsetWidth;
            setContainerWidth(width);
            
            // Calculate items per row based on container width
            const itemWidth = 120; // minimum item width
            const gap = 16; // gap between items
            const maxItemsPerRow = Math.floor((width + gap) / (itemWidth + gap));
            setItemsPerRow(Math.max(1, maxItemsPerRow));
        }
    }, [items]);

    const addItem = () => {
        setItems(prev => [...prev, `Item ${prev.length + 1}`]);
    };

    const removeItem = () => {
        setItems(prev => prev.slice(0, -1));
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Button onClick={addItem} size="sm">
                    Add Item
                </Button>
                <Button onClick={removeItem} size="sm" variant="outline" disabled={items.length === 0}>
                    Remove Item
                </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
                Container width: {containerWidth}px | Items per row: {itemsPerRow}
            </div>
            
            <div
                ref={containerRef}
                className="border rounded-lg p-4 min-h-[200px] resize-x overflow-auto"
                style={{ width: '100%', maxWidth: '600px' }}
            >
                <div 
                    className="grid gap-4"
                    style={{ 
                        gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
                        transition: 'none'
                    }}
                >
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg text-center font-medium"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Example 7: Performance Comparison
const PerformanceComparison = () => {
    const [useLayoutVersion, setUseLayoutVersion] = useState(false);
    const [iterations, setIterations] = useState(0);
    const [measurementTime, setMeasurementTime] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const performMeasurements = useCallback(() => {
        const start = performance.now();
        
        // Simulate multiple DOM measurements
        if (containerRef.current) {
            let totalHeight = 0;
            const children = containerRef.current.children;
            
            for (let i = 0; i < children.length; i++) {
                const rect = children[i].getBoundingClientRect();
                totalHeight += rect.height;
            }
        }
        
        const end = performance.now();
        setMeasurementTime(end - start);
    }, []);

    useEffect(() => {
        if (!useLayoutVersion) {
            performMeasurements();
        }
    }, [iterations, useLayoutVersion, performMeasurements]);

    useLayoutEffect(() => {
        if (useLayoutVersion) {
            performMeasurements();
        }
    }, [iterations, useLayoutVersion, performMeasurements]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <Label>
                    <input
                        type="checkbox"
                        checked={useLayoutVersion}
                        onChange={(e) => setUseLayoutVersion(e.target.checked)}
                        className="mr-2"
                    />
                    Use useLayoutEffect
                </Label>
                <Button
                    onClick={() => setIterations(i => i + 1)}
                    size="sm"
                >
                    Trigger Measurement ({iterations})
                </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
                Measurement time: {measurementTime.toFixed(3)}ms
                {useLayoutVersion ? ' (synchronous)' : ' (asynchronous)'}
            </div>
            
            <div
                ref={containerRef}
                className="border rounded-lg p-4 space-y-2 max-h-32 overflow-y-auto"
            >
                {Array.from({ length: 10 }, (_, i) => (
                    <div
                        key={i}
                        className="h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded flex items-center justify-center text-white text-sm"
                    >
                        Measured Element {i + 1}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function UseLayoutEffectDemo() {
    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useLayoutEffect Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Understand the differences between useLayoutEffect and useEffect for synchronous DOM operations
                </p>
            </div>

            <Tabs defaultValue="visual" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="visual">Visual Differences</TabsTrigger>
                    <TabsTrigger value="measurements">DOM Measurements</TabsTrigger>
                    <TabsTrigger value="positioning">Positioning</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="visual" className="space-y-6">
                    {/* Flash Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Visual</Badge>
                                <Eye className="h-4 w-4" />
                                Preventing Visual Flash
                            </CardTitle>
                            <CardDescription>
                                Compare useEffect vs useLayoutEffect to see how the latter prevents visual flashing
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FlashComparison />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;// Runs synchronously before paint<br />
                                    &nbsp;&nbsp;element.style.backgroundColor = 'red'<br />
                                    {'}'}, [trigger])
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Animation Synchronization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Animation</Badge>
                                <Zap className="h-4 w-4" />
                                Animation Synchronization
                            </CardTitle>
                            <CardDescription>
                                Synchronize multiple animations using useLayoutEffect for smooth visual updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AnimationSync />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;// Synchronize multiple DOM updates<br />
                                    &nbsp;&nbsp;element1.style.transform = `rotate(${'${rotation}deg'})`<br />
                                    &nbsp;&nbsp;element2.style.width = `${'${progress}%'}`<br />
                                    {'}'}, [progress])
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="measurements" className="space-y-6">
                    {/* DOM Measurements */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Measurements</Badge>
                                <Ruler className="h-4 w-4" />
                                Real-time DOM Measurements
                            </CardTitle>
                            <CardDescription>
                                Measure DOM elements immediately after they're updated using useLayoutEffect
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DOMeasurements />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;const rect = element.getBoundingClientRect()<br />
                                    &nbsp;&nbsp;setMeasurements({'{'} width: rect.width, height: rect.height {'}'})<br />
                                    {'}'}, [content])
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dynamic Layout */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Layout</Badge>
                                <Layout className="h-4 w-4" />
                                Dynamic Layout Adjustments
                            </CardTitle>
                            <CardDescription>
                                Automatically adjust layout based on container size measurements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DynamicLayout />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;const width = container.offsetWidth<br />
                                    &nbsp;&nbsp;const itemsPerRow = Math.floor(width / itemWidth)<br />
                                    &nbsp;&nbsp;setItemsPerRow(itemsPerRow)<br />
                                    {'}'}, [items])
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="positioning" className="space-y-6">
                    {/* Tooltip Positioning */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Positioning</Badge>
                                <Target className="h-4 w-4" />
                                Precise Tooltip Positioning
                            </CardTitle>
                            <CardDescription>
                                Position tooltips precisely using DOM measurements to avoid screen edge overflow
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TooltipPositioning />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;const buttonRect = button.getBoundingClientRect()<br />
                                    &nbsp;&nbsp;const tooltipRect = tooltip.getBoundingClientRect()<br />
                                    &nbsp;&nbsp;const position = calculatePosition(buttonRect, tooltipRect)<br />
                                    &nbsp;&nbsp;setTooltipPosition(position)<br />
                                    {'}'}, [showTooltip])
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Scroll Synchronization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Scroll</Badge>
                                <Move className="h-4 w-4" />
                                Scroll Position Synchronization
                            </CardTitle>
                            <CardDescription>
                                Synchronize scroll indicators with scroll position using immediate DOM updates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollSync />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;const handleScroll = () =&gt; {'{'}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;const percentage = (scrollTop / scrollHeight) * 100<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;indicator.style.transform = `translateY(${'${percentage}%'})`<br />
                                    &nbsp;&nbsp;{'}'}<br />
                                    &nbsp;&nbsp;container.addEventListener('scroll', handleScroll)<br />
                                    {'}'}, [])
                                </code>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                    {/* Performance Comparison */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Performance</Badge>
                                <Timer className="h-4 w-4" />
                                Performance Comparison
                            </CardTitle>
                            <CardDescription>
                                Compare the timing of useEffect vs useLayoutEffect for DOM measurements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PerformanceComparison />
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <code className="text-sm">
                                    // useLayoutEffect runs synchronously<br />
                                    useLayoutEffect(() =&gt; {'{'}<br />
                                    &nbsp;&nbsp;// Blocks painting until complete<br />
                                    &nbsp;&nbsp;performDOMmeasurements()<br />
                                    {'}'}, [trigger])
                                </code>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Best Practices */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Guidelines</Badge>
                                <Layers className="h-4 w-4" />
                                When to Use useLayoutEffect
                            </CardTitle>
                            <CardDescription>
                                Understanding when useLayoutEffect is necessary vs when useEffect is sufficient
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Alert>
                                    <Eye className="h-4 w-4" />
                                    <AlertDescription>
                                        <strong>Use useLayoutEffect when:</strong> You need to read layout from the DOM and 
                                        synchronously re-render to prevent visual flashing.
                                    </AlertDescription>
                                </Alert>
                                
                                <Alert>
                                    <Zap className="h-4 w-4" />
                                    <AlertDescription>
                                        <strong>Use useEffect when:</strong> You're doing side effects that don't need 
                                        to happen before the browser paints (API calls, subscriptions, etc.).
                                    </AlertDescription>
                                </Alert>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-green-600">✅ Good for useLayoutEffect:</h4>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• DOM measurements</li>
                                            <li>• Tooltip positioning</li>
                                            <li>• Scroll synchronization</li>
                                            <li>• Preventing visual flashing</li>
                                            <li>• Animation synchronization</li>
                                        </ul>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-blue-600">✅ Good for useEffect:</h4>
                                        <ul className="space-y-1 text-muted-foreground">
                                            <li>• API calls</li>
                                            <li>• Event listeners</li>
                                            <li>• Timers and intervals</li>
                                            <li>• Subscriptions</li>
                                            <li>• Logging and analytics</li>
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
                            <h4 className="font-medium">⚡ Synchronous Execution</h4>
                            <p className="text-sm text-muted-foreground">
                                useLayoutEffect runs synchronously before the browser paints, blocking rendering until complete.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎨 Prevents Visual Flash</h4>
                            <p className="text-sm text-muted-foreground">
                                DOM updates happen before paint, eliminating visual flashing that can occur with useEffect.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">📏 DOM Measurements</h4>
                            <p className="text-sm text-muted-foreground">
                                Perfect for reading layout information and making adjustments before the user sees them.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎯 Precise Positioning</h4>
                            <p className="text-sm text-muted-foreground">
                                Calculate element positions and adjust layouts based on actual DOM measurements.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚠️ Performance Impact</h4>
                            <p className="text-sm text-muted-foreground">
                                Can block rendering if overused. Only use when synchronous execution is truly necessary.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 Browser Compatibility</h4>
                            <p className="text-sm text-muted-foreground">
                                Works the same as useEffect on server-side rendering, falling back to useEffect.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}