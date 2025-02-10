import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import { SelectableCard } from '../ui/selectable-card'

interface TestVideoCardProps {
  video: TestVideo;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}

export const TestVideoCard: React.FC<TestVideoCardProps> = ({ video, onSelect }) => {
  const [searchParams] = useSearchParams();
  const isListView = searchParams.get('layout') === 'list';

  return (
    <SelectableCard id={video.videoId} onSelect={onSelect}>
      <Link to={`/test-dashboard/${video.videoId}`}>
        <CardContent className={cn(
          "p-4 pt-10 relative",
          isListView && "flex items-start gap-4"
        )}>
          {isListView && (
            <div className="absolute top-2 right-2">
              <Badge variant={video.status === 'processing' ? 'primary' : 'success'}>
                {video.status}
              </Badge>
            </div>
          )}
          {video.thumbnail && (
            <div className={cn(
              "rounded-md overflow-hidden",
              isListView 
                ? "w-20 h-20 flex-shrink-0"
                : "aspect-video w-full mb-4"
            )}>
              <img 
                src={video.thumbnail} 
                alt={video.description}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={cn(
            isListView && "flex-1 min-w-0 relative"
          )}>
            {!isListView && (
              <div className="absolute top-[7px] right-2">
                <Badge variant={video.status === 'processing' ? 'primary' : 'success'}>
                  {video.status}
                </Badge>
              </div>
            )}
            <h3 className={cn(
              "text-sm font-medium",
              isListView && "line-clamp-2"
            )}>
              {video.description}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              By: {video.author.name}
            </p>
          </div>
        </CardContent>
      </Link>
    </SelectableCard>
  );
}; 