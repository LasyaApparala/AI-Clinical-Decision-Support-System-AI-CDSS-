// CitationPanel.tsx
import React from 'react'
type Source = { id: string, snippet: string, url?: string, score?: number }

export default function CitationPanel({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null
  
  return (
    <aside className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Sources</h4>
      <div className="space-y-3">
        {sources.map((source, index) => (
          <div key={source.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">[{index + 1}]</span>
              {typeof source.score === 'number' && (
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                  {source.score.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-700 mb-2 line-clamp-3">
              {source.snippet}
            </p>
            {source.url && (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                View source →
              </a>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
