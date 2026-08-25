import { lazy, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { useTreeStore } from "@/hooks/useTreeStore";
import { useMemberStore } from "@/hooks/useMemberStore";
import { Tree } from "@/types/tree";
import { DEMO_TREE_ID, buildDemoMembers } from "@/components/public/demoTreeData";

// Reuse the same lazily-loaded canvas the authenticated app and public viewer
// share, so the demo goes through the exact same rendering + filtering path.
const FlowPanel = lazy(() =>
  import("@/components/view/tree-view/FlowPanel").then((m) => ({
    default: m.FlowPanel,
  })),
);

interface Props {
  onExit: () => void;
}

/**
 * Fully local, backend-free demo tree. Seeds the normal tree/member stores with
 * inline demo data (role "viewer" so the canvas is read-only) and renders the
 * real interactive canvas in a chromeless shell — no login, no network, no
 * localStorage login state. On unmount the stores are torn back down so a
 * subsequent login starts clean.
 */
export const DemoTreeViewer = ({ onExit }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "demo-tree" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const demoTree: Tree = {
      id: DEMO_TREE_ID,
      name: t("title"),
      role: "viewer",
      public_role: "viewer",
    };
    const members = buildDemoMembers();

    // Seed the stores directly — no API calls. Setting isReady lets FlowPanel
    // build its nodes from the members below.
    useTreeStore.setState({
      trees: [],
      virtualViews: [],
      selectedTree: demoTree,
      metadata: {},
      relationTypes: [],
      isReady: true,
      treeNavStack: [],
    });
    useMemberStore.setState({
      members,
      detailLoadedIds: new Set<string>(),
      windowed: false,
      focusRootId: null,
      windowedForTreeId: null,
      neighborhoodTruncated: false,
      totalMemberCount: members.length,
      pendingLocateMemberId: null,
      undoStack: [],
      redoStack: [],
    });
    setReady(true);

    return () => {
      // Clear the seeded demo data so a later real session starts clean.
      void useTreeStore.getState().disconnect();
    };
  }, [t]);

  return (
    <div className="w-screen h-screen flex flex-col bg-background">
      <header className="flex-none border-b px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("read-only-hint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={onExit}>
            {t("back-to-login")}
          </Button>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        {ready ? (
          <Suspense
            fallback={
              <div className="w-full h-full flex items-center justify-center">
                <Spinner className="size-8" />
              </div>
            }
          >
            <FlowPanel publicView />
          </Suspense>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Spinner className="size-8" />
          </div>
        )}
      </main>
    </div>
  );
};
