import { Link, Outlet, useMatches } from "@remix-run/react";
import MainHeading from "~/components/ui/typography/MainHeading";
import SecondaryHeading from "~/components/ui/typography/SecondaryHeading";
import type { LoaderData } from "./_vault.browse.$projectName";
import { useAnimatedText } from "~/hooks/useAnimatedText";
import { Button } from "~/components/ui/button";

export default function VaultLayout() {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1] as
    | { data: LoaderData }
    | undefined; // The last match will be the current child route

  const title = currentMatch?.data?.title || "Vault";
  const subtitle = currentMatch?.data?.subtitle || "1. Select a Project";

  const animatedTitle = useAnimatedText(title, 50);
  const isHome = title === "Vault";

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="mx-auto w-full max-w-[800px]">
        <div className="flex items-start gap-4">
          <Button asChild variant={"secondary"}>
            <Link to={isHome ? "/" : "/browse"}>Back</Link>
          </Button>
          <div>
            <MainHeading>
              {!isHome && <span className="font-normal">Vault / </span>}
              {animatedTitle}
            </MainHeading>
            <SecondaryHeading>{subtitle}</SecondaryHeading>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
