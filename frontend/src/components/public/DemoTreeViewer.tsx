import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTreeStore, resetTreeStoreForSession } from "@/hooks/useTreeStore";
import { useMemberStore } from "@/hooks/useMemberStore";
import { DEMO_MEMBERS, getDemoTree } from "@/components/public/demoTreeData";

// Lazy so the tree-view bundle stays code-split, mirroring PublicTreeViewer.
const FlowPanel = lazy(() =>
  import("@/components/view/tree-view/FlowPanel").then((m) => ({
    default: m.FlowPanel,
  })),
);

interface Props {
  onExit: () => void;
}

/**
 * Anonymous, fully local read-only family tree. Seeds the normal tree/member
 * stores with built-in demo data and renders the chromeless public canvas —
 * no backend requests are made and no login state is written. Exiting tears
 * the demo data back down so the login screen starts clean.
 */
export const DemoTreeViewer = ({ onExit }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "demo" });
  // Boot the canvas only after the stores are seeded, so FlowPanel never sees
  // an empty tree/member state on its first render.
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useTreeStore.setState({
      selectedTree: getDemoTree(),
      isReady: true,
      relationTypes: [],
      trees: [],
      virtualViews: [],
      metadata: {},
      treeNavStack: [],
    });
    useMemberStore.setState({
      members: DEMO_MEMBERS,
      totalMemberCount: DEMO_MEMBERS.length,
      windowed: false,
      focusRootId: null,
      windowedForTreeId: null,
      neighborhoodTruncated: false,
      neighborhoodUp: 3,
      neighborhoodDown: 3,
      detailLoadedIds: new Set<string>(),
      pendingLocateMemberId: null,
    });
    setReady(true);
    return () => {
      resetTreeStoreForSession();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen flex-col bg-background">
      <header className="flex flex-none items-center justify-between border-b px-6 py-3">
        <div>
          <h1 className="text-lg font-bold">{t("tree-name")}</h1>
          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={onExit}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("back")}
          </Button>
        </div>
      </header>
      <main className="min-h-0 flex-1">
        {ready ? (
          <Suspense
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Spinner className="size-8" />
              </div>
            }
          >
            <FlowPanel publicView localOnly />
          </Suspense>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Spinner className="size-8" />
          </div>
        )}
      </main>
    </div>
  );
};
