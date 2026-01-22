import { useCallback, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '../../../../../../shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../../shadcn/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../../../../shadcn/tooltip';
import { RadioGroup, RadioGroupItem } from '../../../../../../shadcn/radio-group';
import { Label } from '../../../../../../shadcn/label';
import { Checkbox } from '../../../../../../shadcn/checkbox';
import { Separator } from '../../../../../../shadcn/separator';

interface ThumbnailStripFilterProps {

}

export const ThumbnailStripFilter = (props: ThumbnailStripFilterProps) => {

  const [showAll, setShowAll] = useState(true);

  const [withAnnotations, setWithAnnotations] = useState(false);

  const [withActiveUsers, setWithActiveUsers] = useState(false);

  const onFilterChange = useCallback((annotations: boolean, activeUsers: boolean) => {
    const newShowAll = !(annotations || activeUsers);
    setShowAll(newShowAll);
    setWithAnnotations(annotations);
    setWithActiveUsers(activeUsers);
  }, []);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon">
              <SlidersHorizontal strokeWidth={1.7} />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>

        <PopoverContent
          align="end"
          alignOffset={-61}
          className="rounded-lg w-72 shadow-xs border-black/10 text-sm relative p-0"
          side="top"
          sideOffset={8}
          onOpenAutoFocus={evt => evt.preventDefault()}>
          <aside className="leading-relaxed p-4">
            <h3 className="font-bold flex items-center gap-2 pb-3">
              <SlidersHorizontal
                className="w-3.5 h-3.5"
                 /> Filter Pages
            </h3>

            <Separator orientation="vertical" className="w-full mb-4" />

            <RadioGroup 
              className="space-y-1.5 pb-2.5"
              value={showAll ? 'all' : 'filtered'}
              onValueChange={value => setShowAll(value === 'all')}>
              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="all" id="show-all" />
                <Label htmlFor="show-all">Show all pages in the document</Label>
              </div>

              

              <div className="flex items-center gap-1.5">
                <RadioGroupItem value="filtered" id="filtered" />
                <Label htmlFor="filtered">Show only pages with</Label>
              </div>
            </RadioGroup>

            <div className="pl-6 space-y-2">
              <div className="flex items-center gap-2">
                  <Checkbox 
                    id="with-annotations"
                    checked={withAnnotations}
                    onCheckedChange={(checked) => 
                      onFilterChange(!!checked, withActiveUsers)
                    }
                  />
                  <Label 
                    htmlFor="with-annotations" 
                    className="text-sm font-normal">
                    Annotations
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="with-active-users"
                    checked={withActiveUsers}
                    onCheckedChange={(checked) => 
                      onFilterChange(withAnnotations, !!checked)
                    }
                  />
                  <Label 
                    htmlFor="with-active-users" 
                    className="text-sm font-normal">
                    Active users
                  </Label>
                </div>
              </div>
          </aside>
        </PopoverContent>

        <TooltipContent>
          Filter pages
        </TooltipContent>
      </Tooltip>
    </Popover>
  )
}