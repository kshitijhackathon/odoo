import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategoryIcon } from "@/lib/mock-data";

interface FilterBarProps {
  onFilterChange: (filters: {
    category: string;
    status: string;
    distance: string;
  }) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeStatus, setActiveStatus] = useState("all");
  const [distance, setDistance] = useState("5km");

  const handleFilterUpdate = (type: string, value: string) => {
    let newCategory = activeCategory;
    let newStatus = activeStatus;
    let newDistance = distance;

    if (type === "category") {
      newCategory = value;
      setActiveCategory(value);
    } else if (type === "status") {
      newStatus = value;
      setActiveStatus(value);
    } else if (type === "distance") {
      newDistance = value;
      setDistance(value);
    }

    onFilterChange({
      category: newCategory,
      status: newStatus,
      distance: newDistance,
    });
  };

  const categories = [
    { id: "all", label: "All Issues" },
    { id: "garbage", label: "Waste" },
    { id: "water", label: "Water" },
    { id: "roads", label: "Roads" },
    { id: "traffic", label: "Traffic" },
    { id: "lighting", label: "Lighting" },
    { id: "parks", label: "Parks" },
  ];

  const statuses = [
    { id: "all", label: "All Status", color: "bg-gray-500" },
    { id: "reported", label: "Reported", color: "bg-civic-blue" },
    { id: "in-progress", label: "In Progress", color: "bg-civic-amber" },
    { id: "resolved", label: "Resolved", color: "bg-civic-emerald" },
  ];

  return (
    <div className="bg-card border-b border-border px-4 py-4 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  activeCategory === category.id
                    ? "bg-civic-blue hover:bg-civic-blue/90"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleFilterUpdate("category", category.id)}
              >
                {category.id !== "all" && getCategoryIcon(category.id)} {category.label}
              </Badge>
            ))}
          </div>
          
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 border-l border-border pl-3">
            {statuses.map((status) => (
              <Badge
                key={status.id}
                variant={activeStatus === status.id ? "default" : "secondary"}
                className={`cursor-pointer transition-colors ${
                  activeStatus === status.id
                    ? "bg-civic-blue hover:bg-civic-blue/90"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => handleFilterUpdate("status", status.id)}
              >
                {status.id !== "all" && (
                  <span className={`w-2 h-2 rounded-full mr-2 ${status.color}`}></span>
                )}
                {status.label}
              </Badge>
            ))}
          </div>
          
          {/* Distance Filter */}
          <div className="border-l border-border pl-3">
            <Select value={distance} onValueChange={(value) => handleFilterUpdate("distance", value)}>
              <SelectTrigger className="w-24 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1km">📍 1km</SelectItem>
                <SelectItem value="3km">📍 3km</SelectItem>
                <SelectItem value="5km">📍 5km</SelectItem>
                <SelectItem value="10km">📍 10km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
