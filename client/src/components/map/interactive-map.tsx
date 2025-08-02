import { useState } from "react";
import { Plus, Minus, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Issue } from "@shared/schema";
import { getCategoryIcon, getStatusColor } from "@/lib/mock-data";

interface InteractiveMapProps {
  issues: Issue[];
  onIssueClick: (issueId: string) => void;
}

export function InteractiveMap({ issues, onIssueClick }: InteractiveMapProps) {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 2));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));

  // Mock positioning for issues on the map
  const getIssuePosition = (issue: Issue, index: number) => {
    const positions = [
      { top: "20%", left: "32%" },
      { top: "40%", left: "48%" },
      { top: "60%", left: "40%" },
      { top: "32%", left: "60%" },
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="relative h-96 lg:h-[500px] bg-gray-100 overflow-hidden">
      {/* Mock satellite map background */}
      <div 
        className="w-full h-full bg-cover bg-center relative transition-transform duration-300"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600')",
          transform: `scale(${zoom})`
        }}
      >
        <div className="absolute inset-0 bg-blue-900/20"></div>
        
        {/* Issue pins */}
        {issues.map((issue, index) => {
          const position = getIssuePosition(issue, index);
          return (
            <div
              key={issue.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={position}
            >
              <Button
                variant="default"
                size="icon"
                className={`w-8 h-8 rounded-full shadow-lg hover:scale-110 transition-transform text-lg ${getStatusColor(issue.status)}`}
                onClick={() => onIssueClick(issue.id)}
                aria-label={`${issue.category} issue ${issue.status}`}
              >
                {getCategoryIcon(issue.category)}
              </Button>
            </div>
          );
        })}
      </div>
      
      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          aria-label="Zoom in"
          className="bg-white shadow-md"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          aria-label="Zoom out"
          className="bg-white shadow-md"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Center on location"
          className="bg-white shadow-md"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
