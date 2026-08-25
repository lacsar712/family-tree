import { lazy, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { resetTreeStoreForSession, useTreeStore } from "@/hooks/useTreeStore";
import { useMemberStore } from "@/hooks/useMemberStore";
import { DEMO_FAMILY_MEMBERS, DEMO_TREE } from "@/components/demo/demoFamilyTree";

const FlowPanel = lazy(() =>
  import("@/components/view/tree-view/FlowPanel").then((m) => ({
    default: m.FlowPanel,
  })),
);

interface DemoTreeViewerProps {
  onBack: () => void;
}

export const DemoTreeViewer = ({ onBack }: DemoTreeViewerProps) => {
  const { t } = useTranslation(undefined, { keyPrefix: "demo-tree" });

  useEffect(() => {
    resetTreeStoreForSession();
    useTreeStore.setState({
      selectedTree: DEMO_TREE,
      isReady: true,
      relationTypes: [],
      metadata: {},
    });
    useMemberStore.setState({
      members: DEMO_FAMILY_MEMBERS,
      detailLoadedIds: new Set(DEMO_FAMILY_MEMBERS.map((member) => member.id)),
      windowed: false,
      focusRootId: null,
      windowedForTreeId: null,
      neighborhoodTruncated: false,
      totalMemberCount: DEMO_FAMILY_MEMBERS.length,
      pendingLocateMemberId: null,
      undoStack: [],
      redoStack: [],
      isLayouting: false,
    });

    return () => {
      resetTreeStoreForSession();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-background">
      <header className="flex-none border-b px-6 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-lg font-bold truncate">{DEMO_TREE.name}</h1>
          <p className="text-xs text-muted-foreground">{t("read-only-hint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={onBack}>
            {t("back-to-login")}
          </Button>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center">
              <Spinner className="size-8" />
            </div>
          }
        >
          <FlowPanel publicView fitOnReady />
        </Suspense>
      </main>
    </div>
  );
};
