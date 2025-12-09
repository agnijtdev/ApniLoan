import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatBubble from '@/components/ChatBubble';
import LoaderBubble from '@/components/LoaderBubble';
import Button from '@/components/Button';
import { sendChatMessage } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';
import { Send, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${user?.name || 'there'}! I'm your AI Loan Advisor. I'm here to help you find the perfect loan and guide you through the application process. What type of loan are you interested in?`,
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResultButton, setShowResultButton] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputValue.trim(), conversationId);
      
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (response.endProcess || response.showResult) {
        setShowResultButton(true);
      }
    } catch (error) {
      // Mock response for demo
      const mockResponses = [
        "I understand you're looking for a loan. Based on your profile, you might be eligible for our Personal Loan with an interest rate starting at 10.5% p.a. Would you like me to check your eligibility?",
        "Great! Let me analyze your profile. Your income of ₹" + (user?.income?.toLocaleString() || '500,000') + " per annum qualifies you for several loan options. Shall I proceed with the application?",
        "I've submitted your application for review. Our underwriting team will process it shortly. Is there anything else you'd like to know about the loan terms?",
        "Your application has been processed! Click the button below to view your result summary and download the official letter.",
      ];

      const responseIndex = Math.min(messages.filter(m => !m.isUser).length, mockResponses.length - 1);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: mockResponses[responseIndex],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMessage]);

      if (responseIndex === mockResponses.length - 1) {
        setShowResultButton(true);
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-muted">
      {/* Chat Header */}
      <div className="bg-accent text-accent-foreground py-4 px-4 md:px-6 border-b border-border">
        <div className="container mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-primary-foreground font-bold">AI</span>
          </div>
          <div>
            <h1 className="font-semibold">AI Loan Advisor</h1>
            <p className="text-sm text-accent-foreground/70">Online • Ready to help</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="container mx-auto max-w-3xl space-y-4">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}

          {isLoading && <LoaderBubble />}

          {showResultButton && (
            <div className="flex justify-center py-4 animate-slide-up">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/result')}
                className="gap-2"
              >
                View Result Summary
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="bg-background border-t border-border p-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={isLoading}
            />
            <Button
              variant="primary"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'px-4',
                (!inputValue.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Press Enter to send • Our AI advisor is here to help 24/7
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
