import React from 'react';
import { Link } from 'react-router-dom';
import type { TestVideo } from '../../types/TestVideo';
import { Badge } from "../ui/badge"
import { Card, CardContent, CardFooter } from "../ui/card"
import { Checkbox } from "../ui/checkbox"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { MoreVertical } from "lucide-react"
import { cn } from "../../lib/utils"

interface TestVideoCardProps {
  video: TestVideo;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export const TestVideoCard: React.FC<TestVideoCardProps> = ({ video, onSelect, isSelected }) => {
  return (
    <Card className={cn(
      "relative group overflow-hidden transition-all duration-200",
      isSelected && "bg-blue-50 border border-blue-200"
    )}>
      <div className="absolute top-2 left-2 z-10">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelect?.(video.videoId)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
      <Link to={`/test-dashboard/${video.videoId}`}>
        <CardContent className="p-4 pt-10">
          {video.thumbnail && (
            <div className="aspect-video w-full mb-4 rounded-md overflow-hidden">
              <img 
                src={video.thumbnail} 
                alt={video.description}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="absolute top-2 right-2">
            <Badge variant={video.status === 'processing' ? 'primary' : 'success'}>
              {video.status}
            </Badge>
          </div>
          <h3 className="text-sm font-medium">{video.description}</h3>
          <p className="text-sm text-muted-foreground">By: {video.author.name}</p>
        </CardContent>
      </Link>
    </Card>
  );
}; 