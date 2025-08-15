
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoadingVendorPage() {
  return (
    <div className="container py-8 md:py-12">
      <Card className="mb-8 overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <Skeleton className="w-full h-64 md:h-[400px]" />
          </div>
          <div className="md:w-2/3 p-6 md:p-8">
            <Skeleton className="h-6 w-1/4 mb-2" /> {/* Badge + Rating */}
            <Skeleton className="h-10 w-3/4 mb-2" /> {/* Name */}
            <Skeleton className="h-4 w-full mb-1" /> {/* Description line 1 */}
            <Skeleton className="h-4 w-5/6 mb-4" /> {/* Description line 2 */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-3/4" />
              ))}
            </div>
            <Skeleton className="h-9 w-32" /> {/* Button */}
          </div>
        </div>
      </Card>

      <div className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mx-auto mb-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      
      <div className="text-center mb-6">
        <Skeleton className="h-8 w-1/3 mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="p-0 relative">
              <Skeleton className="w-full h-40" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-1" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-9 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
