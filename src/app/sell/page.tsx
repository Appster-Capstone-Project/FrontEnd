import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, PlusCircle } from "lucide-react";

export default function SellPage() {
  return (
    <div className="container py-8 md:py-12">
      <SectionTitle 
        title="Seller Dashboard"
        subtitle="Manage your menu, track orders, and grow your home-cooking business."
        className="mb-10"
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center">
                <PlusCircle className="mr-2 h-5 w-5 text-primary" /> Add New Dish
              </CardTitle>
              <CardDescription>Fill in the details to add a new item to your menu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dishName">Dish Name</Label>
                <Input id="dishName" placeholder="e.g., Butter Chicken" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your dish..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input id="price" type="number" step="0.01" placeholder="12.99" />
                </div>
                <div>
                  <Label htmlFor="portions">Portions Available (Optional)</Label>
                  <Input id="portions" type="number" placeholder="10" />
                </div>
              </div>
              <div>
                <Label htmlFor="dishImage">Dish Image</Label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-input hover:border-primary transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="flex text-sm text-muted-foreground">
                      <label
                        htmlFor="dishImage"
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Upload a file</span>
                        <Input id="dishImage" name="dishImage" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Add Dish to Menu</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Your Active Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for listings */}
              <p className="text-muted-foreground text-sm">You have 3 active dishes.</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">Manage Listings</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-lg">Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for orders */}
              <p className="text-muted-foreground text-sm">No new orders yet.</p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary">View All Orders</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
