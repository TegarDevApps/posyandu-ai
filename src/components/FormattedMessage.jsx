import ReactMarkdown from 'react-markdown'

const FormattedMessage = ({ content }) => {
  // Clean up escaped characters and formatting issues
  const cleanContent = content
    .replace(/\\n/g, '\n')  // Replace \n with actual newline
    .replace(/\\"/g, '"')   // Replace \" with "
    .replace(/\\\\/g, '\\') // Replace \\ with \
    .replace(/\\\{/g, '{')  // Replace \{ with {
    .replace(/\\\}/g, '}')  // Replace \} with }
  
  return (
    <div className="formatted-message prose prose-sm sm:prose max-w-none">
      <ReactMarkdown
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold text-primary mb-3 mt-4 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-bold text-primary mb-2 mt-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 mt-2 first:mt-0">
              {children}
            </h3>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 last:mb-0 leading-relaxed text-sm sm:text-base">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="space-y-2 mb-3 ml-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-2 mb-3 ml-4 list-decimal">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="flex gap-2 text-sm sm:text-base leading-relaxed">
              <span className="text-primary mt-0.5 flex-shrink-0">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-bold text-primary">
              {children}
            </strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-gray-700">
              {children}
            </em>
          ),
          
          // Code
          code: ({ inline, children }) => 
            inline ? (
              <code className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className="block bg-gray-100 text-gray-800 p-3 rounded-lg text-xs sm:text-sm font-mono overflow-x-auto mb-3">
                {children}
              </code>
            ),
          
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary bg-primary/5 pl-4 py-2 mb-3 italic">
              {children}
            </blockquote>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline hover:text-secondary transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  )
}

export default FormattedMessage
