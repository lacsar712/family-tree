import { useEffect, useMemo, useState } from "react";
import { Filter, X } from "lucide-react";
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
import { Member } from "@/types/member";
import { cn } from "@/lib/utils";
import {
  CanvasMemberFilterState,
  DEFAULT_CANVAS_MEMBER_FILTER,
  countActiveCanvasFilters,
  countMatchedMembers,
  getDimmedMemberIds,
} from "@/utils/canvasMemberFilter";

interface CanvasFiltersProps {
  members: Member[];
  /**
   * Receives the ids of members that do NOT match the active filter (null when
   * no filter is active). The canvas dims those nodes without removing them
   * from the layout.
   */
  onDimmedMemberIdsChange?: (ids: ReadonlySet<string> | null) => void;
  className?: string;
}

/**
 * Filter bar for the tree canvas. Control state lives here; all match/decline
 * decisions come from utils/canvasMemberFilter. Non-matching members are faded
 * out by the canvas — they are never removed, so the layout stays intact.
 */
export function CanvasFilters({
  members,
  onDimmedMemberIdsChange,
  className,
}: CanvasFiltersProps) {
  const { t } = useTranslation(undefined, { keyPrefix: "tree-view.filters" });
  const [filter, setFilter] = useState<CanvasMemberFilterState>(
    DEFAULT_CANVAS_MEMBER_FILTER,
  );

  const activeCount = countActiveCanvasFilters(filter);
  const active = activeCount > 0;

  const dimmedIds = useMemo(
    () => getDimmedMemberIds(members, filter),
    [members, filter],
  );
  const matchedCount = useMemo(
    () => countMatchedMembers(members, filter),
    [members, filter],
  );

  useEffect(() => {
    onDimmedMemberIdsChange?.(dimmedIds);
  }, [dimmedIds, onDimmedMemberIdsChange]);

  const yearInputClass = "h-7 w-24 text-xs";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border bg-background/90 px-1.5 py-1 shadow-md",
        className,
      )}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <Filter className="h-3.5 w-3.5" />
            {t("title")}
            {active && (
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
                value={filter.gender}
                onValueChange={(v) =>
                  v &&
                  setFilter({
                    ...filter,
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
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("status")}
              </p>
              <ToggleGroup
                type="single"
                value={filter.status}
                onValueChange={(v) =>
                  v &&
                  setFilter({
                    ...filter,
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
                checked={filter.hasPhoto}
                onCheckedChange={(v) => setFilter({ ...filter, hasPhoto: v })}
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
                  min={0}
                  value={filter.birthYearFrom}
                  onChange={(e) =>
                    setFilter({ ...filter, birthYearFrom: e.target.value })
                  }
                  placeholder={t("year-from")}
                  aria-label={t("year-from")}
                  className={yearInputClass}
                />
                <span className="text-xs text-muted-foreground">–</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={filter.birthYearTo}
                  onChange={(e) =>
                    setFilter({ ...filter, birthYearTo: e.target.value })
                  }
                  placeholder={t("year-to")}
                  aria-label={t("year-to")}
                  className={yearInputClass}
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
                  onClick={() => setFilter(DEFAULT_CANVAS_MEMBER_FILTER)}
                >
                  {t("clear")}
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <span className="whitespace-nowrap text-xs text-muted-foreground">
        {t("matched-count", { matched: matchedCount, total: members.length })}
      </span>

      {active && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 shrink-0"
          aria-label={t("clear")}
          title={t("clear")}
          onClick={() => setFilter(DEFAULT_CANVAS_MEMBER_FILTER)}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
