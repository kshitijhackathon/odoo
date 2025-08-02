import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Camera, MapPin, Flag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [currentLocation, setCurrentLocation] = useState("Lokman Hekim Akay Hastanesi");
  const [anonymous, setAnonymous] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [description, setDescription] = useState("");

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      latitude: 39.9208,
      longitude: 32.8541,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: ReportFormData = {
      title: `${selectedCategory} issue reported`,
      description: description,
      category: selectedCategory,
      latitude: 39.9208,
      longitude: 32.8541,
      address: currentLocation,
      images: imagePreview,
      isAnonymous: anonymous,
    };
    
    onSubmit(submitData);
    
    // Reset form
    setImagePreview([]);
    setSelectedCategory("");
    setDescription("");
    setAnonymous(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-screen overflow-y-auto bg-white dark:bg-gray-900 border border-border rounded-2xl shadow-2xl backdrop-blur-none">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-2 text-xl font-medium text-foreground">
            <Flag className="h-5 w-5 text-muted-foreground" />
            <span>Report New Issue</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Area */}
          <div className="space-y-2">
            <div
              className="h-32 border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-civic-blue transition-colors bg-card"
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {imagePreview.length > 0 ? (
                <div className="flex space-x-2 overflow-x-auto p-2">
                  {imagePreview.map((img, index) => (
                    <div key={index} className="relative flex-shrink-0">
                      <img src={img} alt={`Preview ${index + 1}`} className="h-20 w-20 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Add/Upload Photos</p>
                </div>
              )}
            </div>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Location Map Preview */}
          <div className="space-y-2">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 rounded-lg relative overflow-hidden">
              {/* Mock map with location marker */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-red-500 mx-auto mb-1" />
                  <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {currentLocation}
                  </div>
                </div>
              </div>
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 grid-rows-8 h-full w-full">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className="border border-gray-300"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger className="bg-background border-border">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
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
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="bg-background border-border resize-none"
              rows={4}
            />
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={anonymous}
              onCheckedChange={(checked) => setAnonymous(checked === true)}
              className="border-border"
            />
            <label htmlFor="anonymous" className="text-sm font-medium text-foreground">
              Report Anonymous
            </label>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg"
            disabled={!selectedCategory || !description.trim()}
          >
            Submit Issue
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}