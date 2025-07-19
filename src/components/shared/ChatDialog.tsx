
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import type { Order, Message, Buyer } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { getVendorById } from '@/lib/data';
import WebSocket from 'isomorphic-ws';

interface ChatDialogProps {
  children: React.ReactNode;
  order: Order;
}

// Mock WebSocket server for demonstration
const createMockWebSocket = (initialMessages: Message[], onMessage: (msg: Message) => void) => {
    let mockSocket: { onmessage: (event: any) => void; send: (data: string) => void; close: () => void; };
    
    // Simulate the other person replying
    const simulateReply = (sentMessage: Message) => {
        if (sentMessage.sender === 'buyer') {
            setTimeout(() => {
                const reply: Message = {
                    id: `msg-${Date.now() + 1}`,
                    sender: 'seller',
                    text: `Thanks for your message about order #${order.id.slice(-6)}. We're looking into it.`,
                    timestamp: new Date().toISOString(),
                };
                if (mockSocket && mockSocket.onmessage) {
                    mockSocket.onmessage({ data: JSON.stringify(reply) });
                }
            }, 1500);
        }
    };
    
    mockSocket = {
        onmessage: (event: any) => {},
        send: (data: string) => {
            const message: Message = JSON.parse(data);
            // "Send" the message back to the client immediately for display
             if (mockSocket.onmessage) {
                mockSocket.onmessage({ data: JSON.stringify(message) });
             }
            // Then simulate a reply from the other party
            simulateReply(message);
        },
        close: () => { console.log("Mock WebSocket closed."); }
    };

    return mockSocket as WebSocket;
};

export const ChatDialog: React.FC<ChatDialogProps> = ({ children, order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<'buyer' | 'seller' | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Determine the current user's role
    const role = localStorage.getItem('userRole');
    setCurrentUserRole(role === 'seller' ? 'seller' : 'buyer');

    if (isOpen) {
        // --- REAL-WORLD SCENARIO ---
        // 1. Fetch initial chat history via REST API
        // For demo, we just use the mock data from the order prop
        setMessages(order.messages || []);

        // --- MOCK WEBSOCKET ---
        // 2. Establish WebSocket connection
        const mockSocket = createMockWebSocket(order.messages || [], (newMessage) => {
             setMessages(prev => [...prev, newMessage]);
        });
        
        // This is where you'd connect to your real WebSocket server
        // ws.current = new WebSocket('ws://your-backend-api.com/chat');
        ws.current = mockSocket;

        ws.current.onopen = () => {
            console.log("WebSocket connected");
            // 3. Authenticate and join room
            const token = localStorage.getItem('token');
            ws.current?.send(JSON.stringify({ type: 'auth', token }));
            ws.current?.send(JSON.stringify({ type: 'join', orderId: order.id }));
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data as string);
            setMessages(prev => [...prev, message]);
        };

        ws.current.onclose = () => {
            console.log("WebSocket disconnected");
        };

        return () => {
            ws.current?.close();
        };

    } else {
        setMessages([]);
    }
  }, [isOpen, order.id, order.messages]);
  
  useEffect(() => {
      // Scroll to bottom whenever messages change
      const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
  }, [messages]);


  const seller = getVendorById(order.items[0]?.sellerId || '');

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUserRole && ws.current) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        sender: currentUserRole,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      
      // Send message through WebSocket
      ws.current.send(JSON.stringify(msg));
      setNewMessage('');
    }
  };

  const getChatPartner = () => {
    if (currentUserRole === 'seller') {
      return order.buyer;
    }
    return { name: seller?.name || 'Seller', imageUrl: seller?.profileImageUrl };
  };

  const chatPartner = getChatPartner();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[70vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-3">
             <Avatar className="h-10 w-10 border">
              <AvatarImage src={chatPartner.imageUrl} alt={chatPartner.name} />
              <AvatarFallback>{chatPartner.name?.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
             Chat with {chatPartner.name}
             <p className="text-sm font-normal text-muted-foreground">Order ID: {order.id.slice(-6)}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length > 0 ? messages.map((msg) => {
              const isCurrentUser = msg.sender === currentUserRole;
              return (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  isCurrentUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!isCurrentUser && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={chatPartner.imageUrl} />
                    <AvatarFallback>{chatPartner.name?.substring(0,1)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="max-w-[75%]">
                    <div
                        className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        isCurrentUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {msg.text}
                    </div>
                     <p className={cn("text-xs text-muted-foreground mt-1", isCurrentUser ? 'text-right' : 'text-left')}>
                        {format(new Date(msg.timestamp), 'p')}
                    </p>
                </div>
                 {isCurrentUser && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={currentUserRole === 'buyer' ? order.buyer.imageUrl : seller?.profileImageUrl} />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )}) : (
                <div className="text-center text-sm text-muted-foreground py-8">
                    Start the conversation about your order.
                </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="message"
              placeholder="Type your message..."
              className="flex-1"
              autoComplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button type="submit" size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
