import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Camera, MapPin, Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { insertIssueSchema } from "@shared/schema";

const reportFormSchema = insertIssueSchema.extend({
  images: z.array(z.string()).optional(),
  anonymous: z.boolean().optional(),
});

type ReportFormData = z.infer<typeof reportFormSchema>;

interface ReportIssueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReportFormData) => void;
}

export function ReportIssueModal({ open, onOpenChange, onSubmit }: ReportIssueModalProps) {
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [currentLocation, setCurrentLocation] = useState("123 Main Street, Downtown");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      latitude: 40.7128,
      longitude: -74.0060,
      address: currentLocation,
      images: [],
      isAnonymous: false,
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.slice(0, 5 - imagePreview.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreview(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    // Mock GPS location fetch
    setTimeout(() => {
      const mockLocation = "456 Oak Avenue, Downtown (Current Location)";
      setCurrentLocation(mockLocation);
      form.setValue("address", mockLocation);
      form.setValue("latitude", 40.7589);
      form.setValue("longitude", -73.9851);
      setIsGettingLocation(false);
    }, 1500);
  };

  const handleSubmit = (data: ReportFormData) => {
    const submitData = {
      ...data,
      images: imagePreview,
    };
    onSubmit(submitData);
    form.reset();
    setImagePreview([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Report New Issue</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Briefly describe the issue..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="garbage">🗑️ Waste Management</SelectItem>
                      <SelectItem value="water">💧 Water Issues</SelectItem>
                      <SelectItem value="roads">🚧 Road Problems</SelectItem>
                      <SelectItem value="traffic">🚦 Traffic Issues</SelectItem>
                      <SelectItem value="lighting">💡 Street Lighting</SelectItem>
                      <SelectItem value="parks">🌳 Parks & Recreation</SelectItem>
                      <SelectItem value="other">🔧 Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide details about the issue, including specific location and any relevant information..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Location</FormLabel>
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4 text-civic-blue" />
                  <span className="text-sm text-gray-700">{currentLocation}</span>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="text-civic-blue p-0 h-auto"
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    {isGettingLocation ? "Getting location..." : "Use Current Location"}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="text-civic-blue p-0 h-auto"
                >
                  🗺️ Select on Map
                </Button>
              </div>
            </div>

            <div>
              <FormLabel>Photos (Optional)</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-civic-blue transition-colors mt-2">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload photos or drag and drop</p>
                <p className="text-sm text-gray-500 mb-3">Up to 5 photos, max 10MB each</p>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload">
                  <Button type="button" className="bg-civic-blue hover:bg-civic-blue/90" asChild>
                    <span>Choose Photos</span>
                  </Button>
                </label>
              </div>
              
              {imagePreview.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreview.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Report anonymously (your identity will not be shown)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-civic-blue hover:bg-civic-blue/90"
              >
                Submit Report
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
