import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CanvasMemberFilterState,
  DEFAULT_CANVAS_MEMBER_FILTER,
  isCanvasMemberFilterActive,
} from "@/utils/canvasMemberFilter";
import { cn } from "@/lib/utils";

interface Props {
  filters: CanvasMemberFilterState;
  onChange: (filters: CanvasMemberFilterState) => void;
  matchedCount: number;
  totalCount: number;
  className?: string;
}

function countActiveDimensions(filters: CanvasMemberFilterState): number {
  let count = 0;
  if (filters.gender !== "all") count++;
  if (filters.status !== "all") count++;
  if (filters.hasPhoto) count++;
  if (filters.birthYearFrom.trim() || filters.birthYearTo.trim()) count++;
  return count;
}

/**
 * Filter bar for the tree canvas, rendered next to the search box. Only
 * collects the control state — the matching itself lives in
 * `@/utils/canvasMemberFilter` and is applied by the canvas.
 */
export function CanvasFilters({
  filters,
  onChange,
  matchedCount,
  totalCount,
  className,
}: Props) {
  const { t } = useTranslation(undefined, { keyPrefix: "tree-view.filters" });
  const activeCount = countActiveDimensions(filters);
  const active = isCanvasMemberFilterActive(filters);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 bg-background text-xs shadow-md"
          >
            <Filter className="w-3.5 h-3.5" />
            {t("title")}
            {activeCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-0.5 h-4 min-w-4 px-1 text-[10px]"
              >
                {activeCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("gender")}
              </p>
              <ToggleGroup
                type="single"
                value={filters.gender}
                onValueChange={(v) =>
                  v &&
                  onChange({
                    ...filters,
                    gender: v as CanvasMemberFilterState["gender"],
                  })
                }
                className="flex-wrap justify-start gap-1"
              >
                <ToggleGroupItem value="all" className="h-7 px-2 text-xs">
                  {t("all")}
                </ToggleGroupItem>
                <ToggleGroupItem value="m" className="h-7 px-2 text-xs">
                  {t("male")}
                </ToggleGroupItem>
                <ToggleGroupItem value="f" className="h-7 px-2 text-xs">
                  {t("female")}
                </ToggleGroupItem>
                <ToggleGroupItem value="o" className="h-7 px-2 text-xs">
                  {t("other")}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("status")}
              </p>
              <ToggleGroup
                type="single"
                value={filters.status}
                onValueChange={(v) =>
                  v &&
                  onChange({
                    ...filters,
                    status: v as CanvasMemberFilterState["status"],
                  })
                }
                className="flex-wrap justify-start gap-1"
              >
                <ToggleGroupItem value="all" className="h-7 px-2 text-xs">
                  {t("all")}
                </ToggleGroupItem>
                <ToggleGroupItem value="alive" className="h-7 px-2 text-xs">
                  {t("alive")}
                </ToggleGroupItem>
                <ToggleGroupItem value="deceased" className="h-7 px-2 text-xs">
                  {t("deceased")}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {t("has-photo")}
              </p>
              <Switch
                checked={filters.hasPhoto}
                onCheckedChange={(v) => onChange({ ...filters, hasPhoto: v })}
              />
            </div>
            <Separator />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("birth-year")}
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={filters.birthYearFrom}
                  placeholder={t("birth-year-from")}
                  onChange={(e) =>
                    onChange({ ...filters, birthYearFrom: e.target.value })
                  }
                  className="h-8 text-xs"
                  aria-label={t("birth-year-from")}
                />
                <span className="text-xs text-muted-foreground">–</span>
                <Input
                  type="number"
                  value={filters.birthYearTo}
                  placeholder={t("birth-year-to")}
                  onChange={(e) =>
                    onChange({ ...filters, birthYearTo: e.target.value })
                  }
                  className="h-8 text-xs"
                  aria-label={t("birth-year-to")}
                />
              </div>
            </div>
            {active && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full h-7 text-xs text-muted-foreground"
                  onClick={() => onChange(DEFAULT_CANVAS_MEMBER_FILTER)}
                >
                  {t("reset")}
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <span className="rounded-md bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow-md">
        {t("matched", { matched: matchedCount, total: totalCount })}
      </span>
    </div>
  );
}
