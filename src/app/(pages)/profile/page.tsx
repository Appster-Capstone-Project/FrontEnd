
"use client";

import * as React from 'react';
import SectionTitle from "@/components/shared/SectionTitle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { User, Mail, Phone, Lock } from 'lucide-react';

export default function ProfilePage() {
    const { toast } = useToast();
    const router = useRouter();

    const [user, setUser] = React.useState<{ name: string; email: string; phone?: string; role: string } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        const name = localStorage.getItem('userName');

        if (!token || !role || !name) {
            router.push('/auth/signin');
            return;
        }

        const fetchProfile = async () => {
            setIsLoading(true);
            let endpoint = '';
            // This is a simplified fetch. A real app would have a dedicated /profile endpoint.
            // We are mocking fetching the data that is already in local storage.
            if (role === 'seller') {
                const sellerId = localStorage.getItem('sellerId');
                // In a real app, you would fetch `/api/sellers/${sellerId}`
                // For this demo, we use local storage data.
                setUser({
                    name: localStorage.getItem('userName') || '',
                    email: 'seller-email@example.com', // Placeholder email
                    phone: '123-456-7890', // Placeholder phone
                    role: 'Seller'
                });
            } else {
                 // In a real app, you would fetch `/api/users/profile`
                setUser({
                    name: localStorage.getItem('userName') || '',
                    email: 'user-email@example.com', // Placeholder email
                    role: 'User'
                });
            }
            setIsLoading(false);
        };
        
        fetchProfile();

    }, [router]);
    
    if (isLoading || !user) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="container py-8 md:py-12">
            <SectionTitle
                title="My Profile"
                subtitle="View and manage your account details."
            />
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
                    <CardDescription>{user.role} Account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="flex items-center"><User className="mr-2 h-4 w-4" /> Full Name</Label>
                            <Input id="name" defaultValue={user.name} readOnly />
                        </div>
                        <div>
                            <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4" /> Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} readOnly />
                        </div>
                        {user.phone && (
                            <div>
                                <Label htmlFor="phone" className="flex items-center"><Phone className="mr-2 h-4 w-4" /> Phone Number</Label>
                                <Input id="phone" type="tel" defaultValue={user.phone} readOnly />
                            </div>
                        )}
                    </div>
                     <div className="space-y-4 pt-4 border-t">
                        <h3 className="text-lg font-semibold flex items-center"><Lock className="mr-2 h-4 w-4" /> Security</h3>
                         <div>
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" placeholder="••••••••" />
                        </div>
                         <div>
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" placeholder="••••••••" />
                        </div>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled>Update Profile</Button>
                    <p className="text-center text-xs text-muted-foreground">Profile editing is currently disabled.</p>
                </CardContent>
            </Card>
        </div>
    );
}

const ProfileSkeleton = () => (
    <div className="container py-8 md:py-12">
        <div className="mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-6 w-64 mt-2" />
        </div>
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-8 w-40 mx-auto" />
                <Skeleton className="h-5 w-24 mx-auto mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    </div>
);
