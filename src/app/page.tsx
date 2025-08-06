'use client'

import { useState, useEffect } from 'react'

export default function HTMLSandbox() {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Start coding here...</p>
</body>
</html>`)

  const [currentView, setCurrentView] = useState<'editor' | 'preview'>('editor')
  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviewKey(prev => prev + 1)
    }, 500)

    return () => clearTimeout(timer)
  }, [htmlCode])

  // Hotkey listener
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === ' ') {
        e.preventDefault()
        setCurrentView(prev => prev === 'editor' ? 'preview' : 'editor')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleClear = () => {
    setHtmlCode('')
  }

  const handleReset = () => {
    setHtmlCode(`<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Start coding here...</p>
</body>
</html>`)
  }

  const switchView = (view: 'editor' | 'preview') => {
    setCurrentView(view)
  }

  const wrappedCode = `
    <script>
      setTimeout(() => {
        if (confirm('Script running for 10+ seconds. Stop execution?')) {
          window.stop();
        }
      }, 10000);
    </script>
    ${htmlCode}
  `;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100">
      {/* Main Content Area */}
      <div className="flex-1">
        {/* Code Editor View */}
        {currentView === 'editor' && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between bg-slate-800 px-3 py-2 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-200 font-medium">Editor</span>
                <span className="text-xs text-slate-400">Ctrl+Space to switch</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="px-3 py-1 text-xs bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white rounded transition-all duration-200"
                >
                  Reset
                </button>
                <button
                  onClick={handleClear}
                  className="px-3 py-1 text-xs bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white rounded transition-all duration-200"
                >
                  Clear
                </button>
              </div>
            </div>
            
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="flex-1 p-4 bg-slate-900 text-slate-100 font-mono text-sm resize-none outline-none border-none focus:bg-slate-850 selection:bg-emerald-500/30"
              placeholder="Write your HTML code here..."
              spellCheck={false}
              autoFocus
              style={{ 
                caretColor: '#10b981',
                lineHeight: '1.5'
              }}
            />
            
            <div className="bg-slate-800 px-3 py-2 text-xs text-slate-400 border-t border-slate-700">
              <div className="flex items-center gap-4">
                <span>{htmlCode.split('\n').length} lines</span>
                <span>{htmlCode.length} characters</span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-emerald-400">Ready</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview View */}
        {currentView === 'preview' && (
          <div className="flex flex-col h-full">
            <div className="bg-slate-800 px-3 py-2 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-200 font-medium">Preview</span>
                <span className="text-xs text-slate-400">Ctrl+Space to switch</span>
                <span className="text-xs text-amber-400 flex items-center gap-1">
                  <span>⚠️</span>
                  <span>Public sandbox</span>
                </span>
              </div>
            </div>
            
            <div className="flex-1 bg-white relative">
              <iframe
                key={previewKey}
                srcDoc={wrappedCode}
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-forms allow-modals allow-presentation"
                title="HTML Preview"
                referrerPolicy="no-referrer"
                loading="lazy"
                allow="none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-slate-800 border-t border-slate-700 px-3 py-3">
        <div className="flex justify-center gap-2">
          <button
            onClick={() => switchView('editor')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
              currentView === 'editor'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-200'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => switchView('preview')}
            className={`px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 ${
              currentView === 'preview'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-slate-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}
