
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';

interface BroadcastDialogProps {
  children: React.ReactNode;
  onBroadcast: (message: string) => void;
  dishTitle?: string;
}

export const BroadcastDialog: React.FC<BroadcastDialogProps> = ({ children, onBroadcast, dishTitle }) => {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onBroadcast(message);
      setMessage('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Broadcast to Buyers</DialogTitle>
          <DialogDescription>
            {dishTitle 
                ? `Send an announcement to all buyers of "${dishTitle}".`
                : "Send a message to all buyers with a pending or confirmed order."
            }
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="message">Your Message</Label>
            <Textarea 
              placeholder="e.g., 'Hello everyone, your orders will be ready for pickup at 5:30 PM today.'" 
              id="message" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSend} disabled={!message.trim()}>
            <Send className="mr-2 h-4 w-4" />
            Send Broadcast
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
