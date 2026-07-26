import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 font-sans selection:bg-[#f8b461]/30 selection:text-[#f8b461]">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="mb-6">
          <p className="text-[11px] uppercase font-semibold tracking-widest text-slate-500 mb-1">
            Station Readout
          </p>
          <h1 className="text-3xl font-medium tracking-tight text-slate-100">
            Current Conditions
          </h1>
        </div>

        {/* Content area placeholder */}
        <div className="space-y-6">
          <div className="p-4 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-sm">
            Content Area
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
