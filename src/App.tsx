import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import UseStateDemo from "@/components/hook-components/UseStateDemo.tsx";
import Sidebar from "@/components/Sidebar.tsx";
import {UseEffectDemo} from "@/components/hook-components/UseEffectDemo.tsx";
import {UseContextDemo} from "@/components/hook-components/UseContextHookDemo.tsx";
import {UseReducerDemo} from "@/components/hook-components/UseReducerDemo.tsx";
import {UseCallbackDemo} from "@/components/hook-components/UseCallbackDemo.tsx";
import {UseMemoDemo} from "@/components/hook-components/UseMemoDemo.tsx";
import UseRefDemo from "@/components/hook-components/UseRefDemo.tsx";
import UseLayoutEffectDemo from "@/components/hook-components/UseLayoutEffectDemo.tsx";
import UseImperativeHandleDemo from "@/components/hook-components/UseImperativeHandleDemo.tsx";
import UseDebugValueDemo from "@/components/hook-components/UseDebugValueDemo.tsx";

export type HookType = 'useState' | 'useEffect' | 'useContext' | 'useReducer' | 'useCallback' | 'useMemo' | 'useRef' | 'useImperativeHandle' | 'useLayoutEffect' | 'useDebugValue'

function App() {
  const [selectedHook, setSelectedHook] = useState<HookType>('useState');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderHookDemo = () => {
      switch(selectedHook) {
          case 'useState':
              return <UseStateDemo />
          case 'useEffect':
              return <UseEffectDemo />
          case 'useContext':
              return <UseContextDemo />
          case 'useReducer':
              return <UseReducerDemo />
          case 'useCallback':
              return <UseCallbackDemo />
          case 'useMemo':
              return <UseMemoDemo />
          case 'useRef':
              return <UseRefDemo />
          case 'useImperativeHandle':
              return <UseImperativeHandleDemo />
          case 'useLayoutEffect':
              return <UseLayoutEffectDemo />
          case 'useDebugValue':
              return <UseDebugValueDemo />
          default:
              return <div className="p-8 text-center text-muted-foreground">Hook demo coming soon...</div>
      }
  }

  return (
      <div className="h-screen flex bg-background">
          <div className="flex-1 flex flex-col">
              <header className="border-b bg-card px-6 py-4">
                  <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold">React Hooks Interactive Demo</h1>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSidebarOpen(!sidebarOpen)}
                          className="lg:hidden"
                      >
                        <Menu className="h-4 w-4" />
                      </Button>
                  </div>
              </header>

              {/* Content Area */}
              <main className="flex-1 overflow-auto">
                  {renderHookDemo()}
              </main>
          </div>

          {/* Sidebar */}
          <Sidebar
              selectedHook={selectedHook}
              onHookSelect={setSelectedHook}
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
          />
      </div>
  )
}

export default App
