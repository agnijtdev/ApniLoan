import { Bot } from 'lucide-react';

const LoaderBubble = () => {
  return (
    <div className="flex gap-3 animate-slide-up">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-accent-foreground" />
      </div>

      {/* Loader Bubble */}
      <div className="chat-bubble-ai px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-slow" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-slow" style={{ animationDelay: '200ms' }} />
            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse-slow" style={{ animationDelay: '400ms' }} />
          </div>
          <span className="text-sm text-muted-foreground">AI is thinking...</span>
        </div>
      </div>
    </div>
  );
};

export default LoaderBubble;
