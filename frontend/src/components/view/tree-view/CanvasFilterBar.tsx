import { Filter, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  CanvasFilterState,
  DEFAULT_CANVAS_FILTERS,
  countActiveCanvasFilters,
  isCanvasFilterActive,
} from "@/utils/canvasMemberFilter";

interface CanvasFilterBarProps {
  filters: CanvasFilterState;
  onChange: (filters: CanvasFilterState) => void;
  matchedCount: number;
  totalCount: number;
  className?: string;
}

/**
 * Filter controls rendered on the tree canvas next to the search box. Mirrors
 * the list view's dimensions (gender / status / has-photo) plus a birth-year
 * range. Unmatched members are dimmed on the canvas, never removed, so the
 * layout stays intact — this component only owns the control state and the
 * "matched N / total M" readout.
 */
export const CanvasFilterBar = ({
  filters,
  onChange,
  matchedCount,
  totalCount,
  className,
}: CanvasFilterBarProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "tree-view.filter" });
  const activeCount = countActiveCanvasFilters(filters);
  const active = isCanvasFilterActive(filters);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 bg-background text-xs shadow-md"
          >
            <Filter className="h-3.5 w-3.5" />
            {t("filters")}
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
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("gender")}
              </p>
              <ToggleGroup
                type="single"
                value={filters.gender}
                onValueChange={(v) =>
                  v &&
                  onChange({
                    ...filters,
                    gender: v as CanvasFilterState["gender"],
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
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("status")}
              </p>
              <ToggleGroup
                type="single"
                value={filters.status}
                onValueChange={(v) =>
                  v &&
                  onChange({
                    ...filters,
                    status: v as CanvasFilterState["status"],
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
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("birth-year")}
              </p>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  value={filters.birthYearFrom}
                  placeholder={t("birth-year-from")}
                  aria-label={t("birth-year-from")}
                  onChange={(e) =>
                    onChange({ ...filters, birthYearFrom: e.target.value })
                  }
                  className="h-7 text-xs"
                />
                <span className="text-xs text-muted-foreground">–</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={filters.birthYearTo}
                  placeholder={t("birth-year-to")}
                  aria-label={t("birth-year-to")}
                  onChange={(e) =>
                    onChange({ ...filters, birthYearTo: e.target.value })
                  }
                  className="h-7 text-xs"
                />
              </div>
            </div>
            {active && (
              <>
                <Separator />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full text-xs text-muted-foreground"
                  onClick={() => onChange(DEFAULT_CANVAS_FILTERS)}
                >
                  <X className="mr-1 h-3.5 w-3.5" />
                  {t("clear")}
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <span className="rounded-md border bg-background/90 px-2 py-1 text-xs text-muted-foreground shadow-md">
        {t("match-count", { matched: matchedCount, total: totalCount })}
      </span>
    </div>
  );
};
