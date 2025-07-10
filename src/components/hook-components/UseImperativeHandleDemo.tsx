import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
    Settings, 
    Play, 
    Pause, 
    Volume2,
    VolumeX,
    RotateCcw,
    Save,
    FileText,
    Timer,
    CheckCircle,
    XCircle,
    Bell,
    MessageSquare
} from 'lucide-react'

// Example 1: Basic Counter with Imperative API
interface CounterRef {
    increment: () => void;
    decrement: () => void;
    reset: () => void;
    setValue: (value: number) => void;
    getValue: () => number;
}

const ImperativeCounter = forwardRef<CounterRef>((_, ref) => {
    const [count, setCount] = useState(0);

    useImperativeHandle(ref, () => ({
        increment: () => setCount(prev => prev + 1),
        decrement: () => setCount(prev => prev - 1),
        reset: () => setCount(0),
        setValue: (value: number) => setCount(value),
        getValue: () => count
    }));

    return (
        <div className="text-center p-4 border rounded-lg">
            <div className="text-4xl font-bold mb-2">{count}</div>
            <div className="text-sm text-muted-foreground">
                Counter controlled by parent
            </div>
        </div>
    );
});

ImperativeCounter.displayName = 'ImperativeCounter';

// Example 2: Media Player with Complex Controls
interface MediaStatus {
    isPlaying: boolean;
    currentTime: number;
    volume: number;
}

interface MediaPlayerRef {
    play: () => void;
    pause: () => void;
    stop: () => void;
    seek: (time: number) => void;
    setVolume: (volume: number) => void;
    getStatus: () => MediaStatus;
}

const MediaPlayer = forwardRef<MediaPlayerRef>((_, ref) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(50);
    const [duration] = useState(180); // 3 minutes

    useImperativeHandle(ref, () => ({
        play: () => {
            setIsPlaying(true);
            console.log('Media player started');
        },
        pause: () => {
            setIsPlaying(false);
            console.log('Media player paused');
        },
        stop: () => {
            setIsPlaying(false);
            setCurrentTime(0);
            console.log('Media player stopped');
        },
        seek: (time: number) => {
            setCurrentTime(Math.max(0, Math.min(time, duration)));
            console.log(`Seeking to ${time}s`);
        },
        setVolume: (vol: number) => {
            setVolume(Math.max(0, Math.min(vol, 100)));
            console.log(`Volume set to ${vol}%`);
        },
        getStatus: () => ({ isPlaying, currentTime, volume })
    }));

    // Simulate time progression
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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gray-900 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm">Media Player</span>
                </div>
                <div className="flex items-center gap-2">
                    {volume > 0 ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    <span className="text-sm">{volume}%</span>
                </div>
            </div>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <Progress value={(currentTime / duration) * 100} className="h-2" />
            </div>
            
            <div className="flex items-center justify-center mt-4 gap-2">
                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                <span className="text-sm">
                    {isPlaying ? 'Playing' : 'Paused'}
                </span>
            </div>
        </div>
    );
});

MediaPlayer.displayName = 'MediaPlayer';

// Example 3: Form with Validation API
interface FormRef {
    submit: () => boolean;
    reset: () => void;
    validate: () => { isValid: boolean; errors: string[] };
    focus: (field: string) => void;
    setValue: (field: string, value: string) => void;
}

const ImperativeForm = forwardRef<FormRef>((_, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const messageRef = useRef<HTMLTextAreaElement>(null);

    const validate = () => {
        const newErrors: string[] = [];
        
        if (!formData.name.trim()) newErrors.push('Name is required');
        if (!formData.email.trim()) newErrors.push('Email is required');
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.push('Email is invalid');
        if (!formData.message.trim()) newErrors.push('Message is required');
        
        setErrors(newErrors);
        return { isValid: newErrors.length === 0, errors: newErrors };
    };

    useImperativeHandle(ref, () => ({
        submit: () => {
            const validation = validate();
            if (validation.isValid) {
                setIsSubmitted(true);
                console.log('Form submitted:', formData);
                return true;
            }
            return false;
        },
        reset: () => {
            setFormData({ name: '', email: '', message: '' });
            setErrors([]);
            setIsSubmitted(false);
        },
        validate,
        focus: (field: string) => {
            if (field === 'name') nameRef.current?.focus();
            else if (field === 'email') emailRef.current?.focus();
            else if (field === 'message') messageRef.current?.focus();
        },
        setValue: (field: string, value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    }));

    return (
        <div className="space-y-4 p-4 border rounded-lg">
            {isSubmitted && (
                <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>Form submitted successfully!</AlertDescription>
                </Alert>
            )}
            
            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    ref={nameRef}
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your name"
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    ref={emailRef}
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea
                    id="message"
                    ref={messageRef}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter your message"
                    className="w-full p-2 border rounded-md resize-none"
                    rows={3}
                />
            </div>
            
            {errors.length > 0 && (
                <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                        <ul className="list-disc pl-4">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
});

ImperativeForm.displayName = 'ImperativeForm';

// Example 4: Modal with Imperative API
interface ModalRef {
    open: (content?: string) => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => boolean;
}

const ImperativeModal = forwardRef<ModalRef>((_, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState('Default modal content');

    useImperativeHandle(ref, () => ({
        open: (newContent?: string) => {
            if (newContent) setContent(newContent);
            setIsOpen(true);
        },
        close: () => setIsOpen(false),
        toggle: () => setIsOpen(prev => !prev),
        isOpen: () => isOpen
    }));

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Imperative Modal</h3>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                    >
                        ×
                    </Button>
                </div>
                <p className="text-muted-foreground mb-4">{content}</p>
                <div className="flex justify-end">
                    <Button onClick={() => setIsOpen(false)}>
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
});

ImperativeModal.displayName = 'ImperativeModal';

// Example 5: Timer with Advanced Controls
interface TimerRef {
    start: () => void;
    pause: () => void;
    reset: () => void;
    setTime: (seconds: number) => void;
    addTime: (seconds: number) => void;
    getTime: () => number;
    getStatus: () => { isRunning: boolean; timeRemaining: number };
}

const ImperativeTimer = forwardRef<TimerRef>((_, ref) => {
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isRunning, setIsRunning] = useState(false);
    const [initialTime, setInitialTime] = useState(60);

    useImperativeHandle(ref, () => ({
        start: () => setIsRunning(true),
        pause: () => setIsRunning(false),
        reset: () => {
            setTimeRemaining(initialTime);
            setIsRunning(false);
        },
        setTime: (seconds: number) => {
            setTimeRemaining(seconds);
            setInitialTime(seconds);
        },
        addTime: (seconds: number) => {
            setTimeRemaining(prev => Math.max(0, prev + seconds));
        },
        getTime: () => timeRemaining,
        getStatus: () => ({ isRunning, timeRemaining })
    }));

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            const interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRunning, timeRemaining]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = initialTime > 0 ? ((initialTime - timeRemaining) / initialTime) * 100 : 0;

    return (
        <div className="text-center p-6 border rounded-lg">
            <div className="mb-4">
                <div className="text-4xl font-bold font-mono mb-2">
                    {formatTime(timeRemaining)}
                </div>
                <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-4">
                <Timer className="h-4 w-4" />
                <span className="text-sm text-muted-foreground">
                    {isRunning ? 'Running' : timeRemaining === 0 ? 'Finished' : 'Paused'}
                </span>
            </div>
            
            {timeRemaining === 0 && (
                <Alert>
                    <Bell className="h-4 w-4" />
                    <AlertDescription>Timer finished!</AlertDescription>
                </Alert>
            )}
        </div>
    );
});

ImperativeTimer.displayName = 'ImperativeTimer';

// Example 6: Notification System
interface NotificationRef {
    show: (message: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
    hide: () => void;
    clear: () => void;
}

const NotificationSystem = forwardRef<NotificationRef>((_, ref) => {
    const [notifications, setNotifications] = useState<Array<{
        id: number;
        message: string;
        type: 'success' | 'error' | 'warning' | 'info';
    }>>([]);

    useImperativeHandle(ref, () => ({
        show: (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
            const id = Date.now();
            setNotifications(prev => [...prev, { id, message, type }]);
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, 3000);
        },
        hide: () => {
            setNotifications(prev => prev.slice(1));
        },
        clear: () => {
            setNotifications([]);
        }
    }));

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="h-4 w-4" />;
            case 'error': return <XCircle className="h-4 w-4" />;
            case 'warning': return <Bell className="h-4 w-4" />;
            default: return <MessageSquare className="h-4 w-4" />;
        }
    };

    const getVariant = (type: string) => {
        switch (type) {
            case 'error': return 'destructive';
            default: return 'default';
        }
    };

    return (
        <div className="fixed top-4 right-4 space-y-2 z-50">
            {notifications.map(notification => (
                <Alert key={notification.id} variant={getVariant(notification.type) as 'destructive' | 'default'}>
                    {getIcon(notification.type)}
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            ))}
        </div>
    );
});

NotificationSystem.displayName = 'NotificationSystem';

export default function UseImperativeHandleDemo() {
    // Refs for all examples
    const counterRef = useRef<CounterRef>(null);
    const mediaPlayerRef = useRef<MediaPlayerRef>(null);
    const formRef = useRef<FormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const timerRef = useRef<TimerRef>(null);
    const notificationRef = useRef<NotificationRef>(null);

    // State for examples
    const [counterValue, setCounterValue] = useState('');
    const [mediaStatus, setMediaStatus] = useState<MediaStatus>({
        isPlaying: false,
        currentTime: 0,
        volume: 50
    });
    const [formField, setFormField] = useState('name');
    const [formValue, setFormValue] = useState('');
    const [timerSeconds, setTimerSeconds] = useState('60');

    // Helper functions
    const handleGetCounterValue = () => {
        const value = counterRef.current?.getValue();
        alert(`Current counter value: ${value}`);
    };

    const handleSetCounterValue = () => {
        const value = parseInt(counterValue);
        if (!isNaN(value)) {
            counterRef.current?.setValue(value);
            setCounterValue('');
        }
    };

    const handleGetMediaStatus = () => {
        const status = mediaPlayerRef.current?.getStatus();
        setMediaStatus(status || {
            isPlaying: false,
            currentTime: 0,
            volume: 50
        });
    };

    const handleSetFormValue = () => {
        formRef.current?.setValue(formField, formValue);
        setFormValue('');
    };

    const handleSetTimer = () => {
        const seconds = parseInt(timerSeconds);
        if (!isNaN(seconds) && seconds > 0) {
            timerRef.current?.setTime(seconds);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-6">
            {/* Notification System */}
            <NotificationSystem ref={notificationRef} />

            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold">useImperativeHandle Hook Interactive Demo</h1>
                <p className="text-muted-foreground">
                    Learn how to expose imperative APIs from child components to parent components
                </p>
            </div>

            <Tabs defaultValue="basic" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Basic Usage</TabsTrigger>
                    <TabsTrigger value="forms">Forms & Validation</TabsTrigger>
                    <TabsTrigger value="media">Media Controls</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced Patterns</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6">
                    {/* Basic Counter Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Basic</Badge>
                                <Settings className="h-4 w-4" />
                                Imperative Counter
                            </CardTitle>
                            <CardDescription>
                                Expose increment, decrement, reset, and setValue methods from a counter component
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ImperativeCounter ref={counterRef} />
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={() => counterRef.current?.increment()}
                                        size="sm"
                                    >
                                        Increment
                                    </Button>
                                    <Button 
                                        onClick={() => counterRef.current?.decrement()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Decrement
                                    </Button>
                                    <Button 
                                        onClick={() => counterRef.current?.reset()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                    <Button 
                                        onClick={handleGetCounterValue}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Get Value
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Set value..."
                                        value={counterValue}
                                        onChange={(e) => setCounterValue(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleSetCounterValue} size="sm">
                                        Set Value
                                    </Button>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;increment: () =&gt; setCount(prev =&gt; prev + 1),<br />
                                        &nbsp;&nbsp;decrement: () =&gt; setCount(prev =&gt; prev - 1),<br />
                                        &nbsp;&nbsp;reset: () =&gt; setCount(0),<br />
                                        &nbsp;&nbsp;setValue: (value) =&gt; setCount(value)<br />
                                        {'}'}))
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Modal Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Modal</Badge>
                                <FileText className="h-4 w-4" />
                                Imperative Modal
                            </CardTitle>
                            <CardDescription>
                                Control modal visibility and content from parent component
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ImperativeModal ref={modalRef} />
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={() => modalRef.current?.open()}
                                        size="sm"
                                    >
                                        Open Modal
                                    </Button>
                                    <Button 
                                        onClick={() => modalRef.current?.open('Custom content from parent!')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Open with Custom Content
                                    </Button>
                                    <Button 
                                        onClick={() => modalRef.current?.toggle()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Toggle Modal
                                    </Button>
                                    <Button 
                                        onClick={() => alert(`Modal is ${modalRef.current?.isOpen() ? 'open' : 'closed'}`)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Check Status
                                    </Button>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;open: (content) =&gt; setIsOpen(true),<br />
                                        &nbsp;&nbsp;close: () =&gt; setIsOpen(false),<br />
                                        &nbsp;&nbsp;toggle: () =&gt; setIsOpen(prev =&gt; !prev)<br />
                                        {'}'}))
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="forms" className="space-y-6">
                    {/* Form Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Form</Badge>
                                <Save className="h-4 w-4" />
                                Form with Validation API
                            </CardTitle>
                            <CardDescription>
                                Expose form submission, validation, and field control methods
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ImperativeForm ref={formRef} />
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={() => formRef.current?.submit()}
                                        size="sm"
                                    >
                                        Submit Form
                                    </Button>
                                    <Button 
                                        onClick={() => formRef.current?.reset()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Reset Form
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            const result = formRef.current?.validate();
                                            alert(`Valid: ${result?.isValid}, Errors: ${result?.errors.length}`);
                                        }}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Validate
                                    </Button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    <Button 
                                        onClick={() => formRef.current?.focus('name')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Focus Name
                                    </Button>
                                    <Button 
                                        onClick={() => formRef.current?.focus('email')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Focus Email
                                    </Button>
                                    <Button 
                                        onClick={() => formRef.current?.focus('message')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Focus Message
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <select 
                                        value={formField} 
                                        onChange={(e) => setFormField(e.target.value)}
                                        className="px-3 py-2 border rounded"
                                    >
                                        <option value="name">Name</option>
                                        <option value="email">Email</option>
                                        <option value="message">Message</option>
                                    </select>
                                    <Input
                                        placeholder="New value..."
                                        value={formValue}
                                        onChange={(e) => setFormValue(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleSetFormValue} size="sm">
                                        Set Value
                                    </Button>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;submit: () =&gt; validate() && handleSubmit(),<br />
                                        &nbsp;&nbsp;reset: () =&gt; resetForm(),<br />
                                        &nbsp;&nbsp;validate: () =&gt; validateAllFields(),<br />
                                        &nbsp;&nbsp;focus: (field) =&gt; focusField(field)<br />
                                        {'}'}))
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-6">
                    {/* Media Player Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Media</Badge>
                                <Play className="h-4 w-4" />
                                Media Player Controls
                            </CardTitle>
                            <CardDescription>
                                Complex media player with play, pause, seek, and volume controls
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <MediaPlayer ref={mediaPlayerRef} />
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.play()}
                                        size="sm"
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                    </Button>
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.pause()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </Button>
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.stop()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Stop
                                    </Button>
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.seek(30)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Seek to 30s
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.setVolume(0)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Mute
                                    </Button>
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.setVolume(50)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        50%
                                    </Button>
                                    <Button 
                                        onClick={() => mediaPlayerRef.current?.setVolume(100)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        100%
                                    </Button>
                                    <Button 
                                        onClick={handleGetMediaStatus}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Get Status
                                    </Button>
                                </div>
                                
                                {Object.keys(mediaStatus).length > 0 && (
                                    <div className="p-3 bg-muted rounded-lg">
                                        <pre className="text-sm">
                                            {JSON.stringify(mediaStatus, null, 2)}
                                        </pre>
                                    </div>
                                )}
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;play: () =&gt; setIsPlaying(true),<br />
                                        &nbsp;&nbsp;pause: () =&gt; setIsPlaying(false),<br />
                                        &nbsp;&nbsp;seek: (time) =&gt; setCurrentTime(time),<br />
                                        &nbsp;&nbsp;getStatus: () =&gt; ({'{'} isPlaying, currentTime {'}'})<br />
                                        {'}'}))
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-6">
                    {/* Timer Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Timer</Badge>
                                <Timer className="h-4 w-4" />
                                Advanced Timer Controls
                            </CardTitle>
                            <CardDescription>
                                Timer with start, pause, reset, and time manipulation methods
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <ImperativeTimer ref={timerRef} />
                                
                                <div className="flex flex-wrap gap-2">
                                    <Button 
                                        onClick={() => timerRef.current?.start()}
                                        size="sm"
                                    >
                                        <Play className="h-4 w-4 mr-2" />
                                        Start
                                    </Button>
                                    <Button 
                                        onClick={() => timerRef.current?.pause()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </Button>
                                    <Button 
                                        onClick={() => timerRef.current?.reset()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Reset
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Seconds..."
                                        value={timerSeconds}
                                        onChange={(e) => setTimerSeconds(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleSetTimer} size="sm">
                                        Set Timer
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => timerRef.current?.addTime(10)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        +10s
                                    </Button>
                                    <Button 
                                        onClick={() => timerRef.current?.addTime(-10)}
                                        size="sm"
                                        variant="outline"
                                    >
                                        -10s
                                    </Button>
                                    <Button 
                                        onClick={() => {
                                            const time = timerRef.current?.getTime();
                                            alert(`Time remaining: ${time}s`);
                                        }}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Get Time
                                    </Button>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;start: () =&gt; setIsRunning(true),<br />
                                        &nbsp;&nbsp;setTime: (seconds) =&gt; setTimeRemaining(seconds),<br />
                                        &nbsp;&nbsp;addTime: (seconds) =&gt; setTimeRemaining(prev =&gt; prev + seconds)<br />
                                        {'}'}))
                                    </code>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification System Example */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Badge variant="outline">Notifications</Badge>
                                <Bell className="h-4 w-4" />
                                Notification System
                            </CardTitle>
                            <CardDescription>
                                Show different types of notifications programmatically
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <Button 
                                        onClick={() => notificationRef.current?.show('Success message!', 'success')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Success
                                    </Button>
                                    <Button 
                                        onClick={() => notificationRef.current?.show('Error occurred!', 'error')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Error
                                    </Button>
                                    <Button 
                                        onClick={() => notificationRef.current?.show('Warning message!', 'warning')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Warning
                                    </Button>
                                    <Button 
                                        onClick={() => notificationRef.current?.show('Info message!', 'info')}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Info
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={() => notificationRef.current?.hide()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Hide First
                                    </Button>
                                    <Button 
                                        onClick={() => notificationRef.current?.clear()}
                                        size="sm"
                                        variant="outline"
                                    >
                                        Clear All
                                    </Button>
                                </div>
                                
                                <div className="p-3 bg-muted rounded-lg">
                                    <code className="text-sm">
                                        useImperativeHandle(ref, () =&gt; ({'{'}<br />
                                        &nbsp;&nbsp;show: (message, type) =&gt; addNotification(message, type),<br />
                                        &nbsp;&nbsp;hide: () =&gt; removeFirstNotification(),<br />
                                        &nbsp;&nbsp;clear: () =&gt; clearAllNotifications()<br />
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
                            <h4 className="font-medium">🎯 Imperative APIs</h4>
                            <p className="text-sm text-muted-foreground">
                                Expose specific methods from child components that parent components can call directly.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔐 Controlled Exposure</h4>
                            <p className="text-sm text-muted-foreground">
                                Only expose the methods you want parents to access, hiding internal implementation details.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚡ Direct Control</h4>
                            <p className="text-sm text-muted-foreground">
                                Parents can trigger actions in children without re-rendering or prop changes.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🎮 Complex Components</h4>
                            <p className="text-sm text-muted-foreground">
                                Perfect for media players, forms, modals, and other complex UI components.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">🔄 forwardRef Required</h4>
                            <p className="text-sm text-muted-foreground">
                                Must be used with forwardRef to pass refs through functional components.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">⚠️ Use Sparingly</h4>
                            <p className="text-sm text-muted-foreground">
                                Should be used only when declarative patterns with props and callbacks aren't sufficient.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}