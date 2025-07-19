
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

interface ChatDialogProps {
  children: React.ReactNode;
  order: Order;
}

const mockSeller = {
    name: "Priya's Kitchen", // This should be dynamic in a real app
    imageUrl: "https://i.pravatar.cc/80?u=priya"
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ children, order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(order.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    setTimeout(() => {
        const scrollViewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollViewport) {
            scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }
    }, 0);
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);
  

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        sender: 'buyer', // In a real app, this would be determined by the current user
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');

      // Simulate a seller response
      setTimeout(() => {
        const reply: Message = {
            id: `msg-${Date.now() + 1}`,
            sender: 'seller',
            text: "Thanks for your message! We'll get back to you shortly.",
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, reply]);
      }, 1500)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 flex flex-col h-[70vh]">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center gap-3">
             <Avatar className="h-10 w-10 border">
              <AvatarImage src={mockSeller.imageUrl} alt={order.vendorName} />
              <AvatarFallback>{order.vendorName.substring(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
             Chat with {order.vendorName}
             <p className="text-sm font-normal text-muted-foreground">Order ID: {order.id.slice(-6)}</p>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow px-4" ref={scrollAreaRef}>
          <div className="space-y-4 py-4">
            {messages.length > 0 ? messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex items-end gap-2',
                  msg.sender === 'buyer' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.sender === 'seller' && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={mockSeller.imageUrl} />
                    <AvatarFallback>{order.vendorName.substring(0,1)}</AvatarFallback>
                  </Avatar>
                )}
                <div className="max-w-[75%]">
                    <div
                        className={cn(
                        'rounded-lg px-3 py-2 text-sm',
                        msg.sender === 'buyer'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {msg.text}
                    </div>
                     <p className={cn("text-xs text-muted-foreground mt-1", msg.sender === 'buyer' ? 'text-right' : 'text-left')}>
                        {format(new Date(msg.timestamp), 'p')}
                    </p>
                </div>
                 {msg.sender === 'buyer' && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={order.buyer.imageUrl} />
                    <AvatarFallback>{order.buyer.name.substring(0,1)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            )) : (
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
