import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
    Focus,
    Camera,
    Play,
    Pause,
    RotateCcw,
    Timer,
    Target,
    Eye,
    MousePointer,
    Scroll
} from 'lucide-react'
import * as React from "react";

// Interface for video player imperative handle
interface VideoPlayerRef {
    play: () => void;
    pause: () => void;
    seek: (time: number) => void;
}

// Custom video player component for imperative handle example
const VideoPlayer = forwardRef<VideoPlayerRef>((_, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const duration = 100; // Mock duration

    useImperativeHandle(ref, () => ({
        play: () => {
            setIsPlaying(true);
            console.log('Video playing');
        },
        pause: () => {
            setIsPlaying(false);
            console.log('Video paused');
        },
        seek: (time: number) => {
            setCurrentTime(time);
            console.log(`Seeking to ${time}s`);
        }
    }));

    // Simulate video time updates
    useEffect(() => {
        if (isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        setIsPlaying(false);
                        return duration;
                    }
                    return prev + 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isPlaying, duration]);

    return (
        <div className="space-y-2">
            <div className="bg-gray-900 rounded-lg p-4 aspect-video flex items-center justify-center">
                <div className="text-white text-center">
                    <Camera className="h-12 w-12 mx-auto mb-2" />
                    <p>Demo Video Player</p>
                    <p className="text-sm text-gray-400">
                        {isPlaying ? 'Playing' : 'Paused'} - {Math.round(currentTime)}s / {Math.round(duration)}s
                    </p>
                </div>
            </div>
            <Progress value={duration > 0 ? (currentTime / duration) * 100 : 0} />
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default function UseRefDemo() {
    // Example 1: DOM element references
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Example 2: Mutable values (timers, intervals)
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    // Example 3: Previous values
    const [count, setCount] = useState(0);
    const prevCountRef = useRef<number>(null);

    // Example 4: Focus management
    const firstInputRef = useRef<HTMLInputElement>(null);
    const secondInputRef = useRef<HTMLInputElement>(null);
    const thirdInputRef = useRef<HTMLInputElement>(null);

    // Example 5: Scroll to element
    const scrollTargetRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    // Example 6: Mouse tracking
    const mouseDivRef = useRef<HTMLDivElement>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    // Example 7: Canvas drawing
    const [isDrawing, setIsDrawing] = useState(false);

    // Example 8: Video player with imperative handle
    const videoPlayerRef = useRef<VideoPlayerRef>(null);

    // Example 9: Intersection observer
    const observerTargetRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Example 10: Auto-save functionality
    const [autoSaveText, setAutoSaveText] = useState('');
    const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    // Focus input example
    const focusInput = () => {
        inputRef.current?.focus();
    };

    // Clear textarea example
    const clearTextarea = () => {
        if (textareaRef.current) {
            textareaRef.current.value = '';
            textareaRef.current.focus();
        }
    };

    // Timer functionality
    const startTimer = () => {
        if (!isRunning) {
            setIsRunning(true);
            timerRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
            setIsRunning(false);
        }
    };

    const resetTimer = () => {
        stopTimer();
        setSeconds(0);
    };

    // Track previous value
    useEffect(() => {
        prevCountRef.current = count;
    });

    // Focus management
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement | null>) => {
        if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            nextRef?.current?.focus();
        }
    };

    // Scroll functionality
    const scrollToTarget = () => {
        scrollTargetRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Mouse tracking
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (mouseDivRef.current) {
            const rect = mouseDivRef.current.getBoundingClientRect();
            setMousePosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // Canvas drawing
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        draw(e);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#3b82f6';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.beginPath();
        }
    };

    const clearCanvas = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    // Intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (observerTargetRef.current) {
            observer.observe(observerTargetRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Auto-save functionality
    const handleAutoSaveChange = (value: string) => {
        setAutoSaveText(value);

        // Clear existing timeout
        if (autoSaveTimeoutRef.current) {
            clearTimeout(autoSaveTimeoutRef.current);
        }

        // Set new timeout
        autoSaveTimeoutRef.current = setTimeout(() => {
            setLastSaved(new Date());
            console.log('Auto-saved:', value);
        }, 1000);
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (autoSaveTimeoutRef.current) {
                clearTimeout(autoSaveTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useRef Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Explore useRef for DOM manipulation, mutable values, and imperative patterns
                </p>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                    <TabsTrigger value="mutable">Mutable Values</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
                    <TabsTrigger value="practical">Practical Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* DOM Element Access */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">DOM</Badge>
                                <Focus className="h-4 w-4" />
                                Focus Input
                            </CardTitle>
                            <CardDescription>
                                Access DOM elements directly to trigger focus, get values, or call methods
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        ref={inputRef}
                                        placeholder="Click the button to focus me!"
                                        className="flex-1"
                                    />
                                    <Button onClick={focusInput}>
                                        <Focus className="h-4 w-4 mr-2" />
                                        Focus Input
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const inputRef = useRef&lt;HTMLInputElement&gt;(null)<br />
                                        // Later: inputRef.current?.focus()
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Textarea Manipulation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">DOM</Badge>
                                <Target className="h-4 w-4" />
                                Textarea Control
                            </CardTitle>
                            <CardDescription>
                                Directly manipulate textarea content and properties
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="textarea">Type something:</Label>
                                    <textarea
                                        ref={textareaRef}
                                        id="textarea"
                                        className="w-full p-2 border rounded-md resize-none"
                                        rows={3}
                                        placeholder="This textarea can be cleared with the button below"
                                    />
                                </div>
                                <Button onClick={clearTextarea} variant="outline">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Clear & Focus
                                </Button>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        textareaRef.current.value = ''<br />
                                        textareaRef.current.focus()
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Canvas Drawing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Canvas</Badge>
                                <MousePointer className="h-4 w-4" />
                                Canvas Drawing
                            </CardTitle>
                            <CardDescription>
                                Use ref to access canvas context for drawing operations
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <canvas
                                    ref={canvasRef}
                                    width={600}
                                    height={200}
                                    className="border border-gray-300 rounded-lg cursor-crosshair w-full"
                                    onMouseDown={startDrawing}
                                    onMouseMove={draw}
                                    onMouseUp={stopDrawing}
                                    onMouseLeave={stopDrawing}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={clearCanvas} variant="outline">
                                        Clear Canvas
                                    </Button>
                                    <div className="text-sm text-muted-foreground flex items-center">
                                        Click and drag to draw
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const ctx = canvasRef.current?.getContext('2d')
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="mutable" className="space-y-6">
                    {/* Timer with useRef */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                <Timer className="h-4 w-4" />
                                Interval Timer
                            </CardTitle>
                            <CardDescription>
                                Store mutable values like timers that don't trigger re-renders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold font-mono">
                                        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                                        {String(seconds % 60).padStart(2, '0')}
                                    </div>
                                </div>
                                <div className="flex justify-center gap-2">
                                    <Button
                                        onClick={startTimer}
                                        disabled={isRunning}
                                        variant={isRunning ? "secondary" : "default"}
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Start
                                    </Button>
                                    <Button
                                        onClick={stopTimer}
                                        disabled={!isRunning}
                                        variant="outline"
                                    >
                                        <Pause className="h-4 w-4 mr-2" />
                                        Stop
                                    </Button>
                                    <Button onClick={resetTimer} variant="outline">
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const timerRef = useRef&lt;NodeJS.Timeout | null&gt;(null)<br />
                                        timerRef.current = setInterval(...)<br />
                                        clearInterval(timerRef.current)
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Previous Values */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Previous</Badge>
                                <Eye className="h-4 w-4" />
                                Track Previous Values
                            </CardTitle>
                            <CardDescription>
                                Access previous state values without triggering re-renders
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-4">
                                    <Button
                                        onClick={() => setCount(count - 1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        -1
                                    </Button>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">Current: {count}</div>
                                        <div className="text-sm text-muted-foreground">
                                            Previous: {prevCountRef.current ?? 'none'}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setCount(count + 1)}
                                        variant="outline"
                                        size="sm"
                                    >
                                        +1
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const prevCountRef = useRef&lt;number&gt;()<br />
                                        useEffect(() =&gt; {'{'} prevCountRef.current = count {'}'})
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Auto-save */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timeout</Badge>
                                <Timer className="h-4 w-4" />
                                Auto-save with Timeout
                            </CardTitle>
                            <CardDescription>
                                Debounce user input with timeout refs to implement auto-save
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="autosave">Document content:</Label>
                                    <textarea
                                        id="autosave"
                                        className="w-full p-2 border rounded-md resize-none"
                                        rows={4}
                                        value={autoSaveText}
                                        onChange={(e) => handleAutoSaveChange(e.target.value)}
                                        placeholder="Start typing... auto-saves after 1 second of inactivity"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {lastSaved ? (
                                        <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                                    ) : (
                                        <span>No changes saved yet</span>
                                    )}
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const timeoutRef = useRef&lt;NodeJS.Timeout | null&gt;(null)<br />
                                        clearTimeout(timeoutRef.current)<br />
                                        timeoutRef.current = setTimeout(save, 1000)
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {/* Focus Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Focus</Badge>
                                <Focus className="h-4 w-4" />
                                Focus Management
                            </CardTitle>
                            <CardDescription>
                                Create smooth focus flows between form elements
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="first">First Name</Label>
                                        <Input
                                            id="first"
                                            ref={firstInputRef}
                                            placeholder="Press Tab/Enter"
                                            onKeyDown={(e) => handleKeyDown(e, secondInputRef)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="last">Last Name</Label>
                                        <Input
                                            id="last"
                                            ref={secondInputRef}
                                            placeholder="Press Tab/Enter"
                                            onKeyDown={(e) => handleKeyDown(e, thirdInputRef)}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            ref={thirdInputRef}
                                            type="email"
                                            placeholder="Final field"
                                            onKeyDown={(e) => handleKeyDown(e, firstInputRef)}
                                        />
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Press Tab or Enter to move between fields
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        nextInputRef.current?.focus()
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Intersection Observer */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Observer</Badge>
                                <Eye className="h-4 w-4" />
                                Intersection Observer
                            </CardTitle>
                            <CardDescription>
                                Track element visibility using Intersection Observer API
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="h-32 overflow-y-auto border rounded-lg p-4">
                                    <div className="h-20 bg-gray-100 rounded mb-4 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Scroll down...</span>
                                    </div>
                                    <div className="h-20 bg-gray-100 rounded mb-4 flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Keep scrolling...</span>
                                    </div>
                                    <div
                                        ref={observerTargetRef}
                                        className={`h-20 rounded mb-4 flex items-center justify-center transition-colors ${
                                            isVisible ? 'bg-green-100 border-green-500' : 'bg-red-100 border-red-500'
                                        } border-2`}
                                    >
                                        <span className={`text-sm font-medium ${
                                            isVisible ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {isVisible ? '👀 Visible!' : '🙈 Hidden'}
                                        </span>
                                    </div>
                                    <div className="h-20 bg-gray-100 rounded flex items-center justify-center">
                                        <span className="text-sm text-gray-500">Bottom content</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const observer = new IntersectionObserver(...)<br />
                                        observer.observe(targetRef.current)
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
                                <MousePointer className="h-4 w-4" />
                                Mouse Position Tracking
                            </CardTitle>
                            <CardDescription>
                                Track mouse position relative to a specific element
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div
                                    ref={mouseDivRef}
                                    className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 border rounded-lg relative overflow-hidden cursor-crosshair"
                                    onMouseMove={handleMouseMove}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <MousePointer className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                            <div className="text-sm text-gray-600">
                                                Move your mouse here
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                X: {Math.round(mousePosition.x)}, Y: {Math.round(mousePosition.y)}
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="absolute w-2 h-2 bg-red-500 rounded-full transform -translate-x-1 -translate-y-1 pointer-events-none"
                                        style={{
                                            left: mousePosition.x,
                                            top: mousePosition.y,
                                        }}
                                    />
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        const rect = divRef.current?.getBoundingClientRect()<br />
                                        const x = e.clientX - rect.left
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="practical" className="space-y-6">
                    {/* Scroll to Element */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Scroll</Badge>
                                <Scroll className="h-4 w-4" />
                                Scroll to Element
                            </CardTitle>
                            <CardDescription>
                                Programmatically scroll to specific elements in the page
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Button onClick={scrollToTarget} variant="outline">
                                        <Scroll className="h-4 w-4 mr-2" />
                                        Scroll to Target
                                    </Button>
                                    <div className="text-sm text-muted-foreground">
                                        Current scroll: {Math.round(scrollPosition)}px
                                    </div>
                                </div>
                                <div className="h-32 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                                    <div className="space-y-4">
                                        <div className="h-16 bg-white rounded border flex items-center justify-center">
                                            <span className="text-sm text-gray-500">Content above target</span>
                                        </div>
                                        <div className="h-16 bg-white rounded border flex items-center justify-center">
                                            <span className="text-sm text-gray-500">More content...</span>
                                        </div>
                                        <div
                                            ref={scrollTargetRef}
                                            className="h-16 bg-blue-100 rounded border-2 border-blue-300 flex items-center justify-center"
                                        >
                                            <span className="text-sm font-medium text-blue-700">🎯 Target Element</span>
                                        </div>
                                        <div className="h-16 bg-white rounded border flex items-center justify-center">
                                            <span className="text-sm text-gray-500">Content below target</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        targetRef.current?.scrollIntoView({'{'} behavior: 'smooth' {'}'})
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Video Player Control */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Imperative</Badge>
                                <Play className="h-4 w-4" />
                                Video Player Control
                            </CardTitle>
                            <CardDescription>
                                Control child components imperatively using useImperativeHandle
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <VideoPlayer ref={videoPlayerRef} />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => videoPlayerRef.current?.play()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                    </Button>
                                    <Button
                                        onClick={() => videoPlayerRef.current?.pause()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </Button>
                                    <Button
                                        onClick={() => videoPlayerRef.current?.seek(10)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Seek to 10s
                                    </Button>
                                </div>
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;play: () =&gt; videoRef.current?.play(),<br />
                                        &nbsp;&nbsp;pause: () =&gt; videoRef.current?.pause()<br />
                                        {'}'}))
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
                            <h4 className="font-medium">🎯 DOM References</h4>
                            <p className="text-sm text-muted-foreground">
                                Access DOM elements directly to call methods like focus(), scrollIntoView(), or getContext().
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">💾 Mutable Values</h4>
                            <p className="text-sm text-muted-foreground">
                                Store values that persist across renders without triggering re-renders when changed.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⏱️ Timers & Intervals</h4>
                            <p className="text-sm text-muted-foreground">
                                Store timer IDs to properly clean up intervals and timeouts in useEffect.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 Previous Values</h4>
                            <p className="text-sm text-muted-foreground">
                                Keep track of previous state values for comparison or animation purposes.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎮 Imperative APIs</h4>
                            <p className="text-sm text-muted-foreground">
                                Combine with useImperativeHandle to create imperative APIs for child components.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ No Re-renders</h4>
                            <p className="text-sm text-muted-foreground">
                                Changing ref.current doesn't trigger re-renders, making refs perfect for mutable data.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}