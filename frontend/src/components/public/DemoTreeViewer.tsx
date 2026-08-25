import { lazy, Suspense, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { resetTreeStoreForSession, useTreeStore } from "@/hooks/useTreeStore";
import { useMemberStore } from "@/hooks/useMemberStore";
import { getDemoMembers, getDemoTree } from "@/utils/demoTreeData";

// Lazy so the tree-view bundle stays code-split (shared with the
// authenticated app's lazy import and the public tree viewer).
const FlowPanel = lazy(() =>
  import("@/components/view/tree-view/FlowPanel").then((m) => ({
    default: m.FlowPanel,
  })),
);

interface Props {
  onExit: () => void;
}

/**
 * Login-free demo: boots the tree/member stores with a built-in local demo
 * tree (no backend requests, no auth state touched) and renders the same
 * read-only canvas as the public tree viewer.
 */
export const DemoTreeViewer = ({ onExit }: Props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "demo-tree" });
  const tree = useMemo(getDemoTree, []);
  const members = useMemo(getDemoMembers, []);

  useEffect(() => {
    useTreeStore.setState({
      selectedTree: tree,
      isReady: true,
      relationTypes: [],
      metadata: {},
    });
    useMemberStore.setState({
      members,
      windowed: false,
      focusRootId: null,
      neighborhoodTruncated: false,
      totalMemberCount: members.length,
      pendingLocateMemberId: null,
    });
    // Leaving the demo tears the local tree back down so a later login or
    // public link starts from a clean store.
    return () => resetTreeStoreForSession();
  }, [tree, members]);

  return (
    <div className="w-screen h-screen flex flex-col bg-background">
      <header className="flex-none border-b px-6 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">{t("title")}</h1>
          <p className="text-xs text-muted-foreground">{t("hint")}</p>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="outline" onClick={onExit}>
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
          <FlowPanel publicView />
        </Suspense>
      </main>
    </div>
  );
};
