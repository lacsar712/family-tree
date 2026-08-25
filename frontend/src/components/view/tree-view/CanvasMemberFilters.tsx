import { Filter, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CanvasMemberFilterState,
  DEFAULT_CANVAS_MEMBER_FILTER,
  isDefaultCanvasMemberFilter,
} from "@/utils/canvasMemberFilter";

interface CanvasMemberFiltersProps {
  filters: CanvasMemberFilterState;
  matchedCount: number;
  totalCount: number;
  onChange: (filters: CanvasMemberFilterState) => void;
  className?: string;
}

function parseYearInput(value: string): number | null {
  if (!value.trim()) return null;
  const year = Number.parseInt(value, 10);
  return Number.isFinite(year) ? year : null;
}

export const CanvasMemberFilters = ({
  filters,
  matchedCount,
  totalCount,
  onChange,
  className,
}: CanvasMemberFiltersProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "tree-view.filters" });
  const currentYear = new Date().getFullYear();
  const isDefault = isDefaultCanvasMemberFilter(filters);

  const update = (changes: Partial<CanvasMemberFilterState>) => {
    onChange({ ...filters, ...changes });
  };

  return (
    <div
      className={cn(
        "rounded-md border bg-background/95 p-2 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/85",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 pr-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">{t("title")}</span>
        </div>

        <ToggleGroup
          type="single"
          value={filters.gender}
          onValueChange={(value) =>
            value && update({ gender: value as CanvasMemberFilterState["gender"] })
          }
          className="justify-start gap-1"
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

        <Separator orientation="vertical" className="mx-0.5 h-6" />

        <ToggleGroup
          type="single"
          value={filters.status}
          onValueChange={(value) =>
            value && update({ status: value as CanvasMemberFilterState["status"] })
          }
          className="justify-start gap-1"
        >
          <ToggleGroupItem value="all" className="h-7 px-2 text-xs">
            {t("all-status")}
          </ToggleGroupItem>
          <ToggleGroupItem value="alive" className="h-7 px-2 text-xs">
            {t("alive")}
          </ToggleGroupItem>
          <ToggleGroupItem value="deceased" className="h-7 px-2 text-xs">
            {t("deceased")}
          </ToggleGroupItem>
        </ToggleGroup>

        <Separator orientation="vertical" className="mx-0.5 h-6" />

        <label className="flex items-center gap-1.5 text-xs">
          <Switch
            checked={filters.hasPhoto}
            onCheckedChange={(value) => update({ hasPhoto: value })}
            className="scale-75"
          />
          {t("has-photo")}
        </label>

        <Separator orientation="vertical" className="mx-0.5 h-6" />

        <div className="flex items-center gap-1.5 text-xs">
          <Label htmlFor="canvas-filter-birth-start" className="text-xs">
            {t("born")}
          </Label>
          <Input
            id="canvas-filter-birth-start"
            type="number"
            min={1}
            max={currentYear}
            value={filters.birthStartYear ?? ""}
            onChange={(event) =>
              update({ birthStartYear: parseYearInput(event.target.value) })
            }
            aria-label={t("start-year")}
            placeholder={t("start-year")}
            className="h-7 w-20 px-2 text-xs"
          />
          <span aria-hidden="true">–</span>
          <Input
            id="canvas-filter-birth-end"
            type="number"
            min={1}
            max={currentYear}
            value={filters.birthEndYear ?? ""}
            onChange={(event) =>
              update({ birthEndYear: parseYearInput(event.target.value) })
            }
            aria-label={t("end-year")}
            placeholder={t("end-year")}
            className="h-7 w-20 px-2 text-xs"
          />
        </div>

        <Badge variant="secondary" className="h-6 text-xs">
          {t("matched-count", { matched: matchedCount, total: totalCount })}
        </Badge>

        {!isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => onChange(DEFAULT_CANVAS_MEMBER_FILTER)}
          >
            <X className="h-3.5 w-3.5" />
            {t("clear")}
          </Button>
        )}
      </div>
    </div>
  );
};
