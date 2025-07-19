
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

interface ChatDialogProps {
  children: React.ReactNode;
  order: Order;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({ children, order }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(order.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<'buyer' | 'seller' | null>(null);

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
    // Determine the current user's role to style the chat bubbles correctly
    const role = localStorage.getItem('userRole');
    if (role === 'seller') {
      setCurrentUserRole('seller');
    } else {
      setCurrentUserRole('buyer');
    }

    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const seller = getVendorById(order.items[0]?.sellerId || '');

  const handleSendMessage = () => {
    if (newMessage.trim() && currentUserRole) {
      const msg: Message = {
        id: `msg-${Date.now()}`,
        sender: currentUserRole,
        text: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');

      // Simulate a reply if the buyer sends a message
      if (currentUserRole === 'buyer') {
          setTimeout(() => {
            const reply: Message = {
                id: `msg-${Date.now() + 1}`,
                sender: 'seller',
                text: "Thanks for your message! We'll get back to you shortly.",
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, reply]);
          }, 1500);
      }
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
