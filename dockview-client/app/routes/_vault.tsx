import { Link, Outlet, useMatches } from "@remix-run/react";
import MainHeading from "~/components/ui/typography/MainHeading";
import SecondaryHeading from "~/components/ui/typography/SecondaryHeading";
import type { LoaderData } from "./_vault.browse.$projectName";
import { useAnimatedText } from "~/hooks/useAnimatedText";
import { Button } from "~/components/ui/button";
import Container from "~/components/layout/Container";

export default function VaultLayout() {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1] as
    | { data: LoaderData }
    | undefined; // The last match will be the current child route

  const title = currentMatch?.data?.title || "Vault";
  const subtitle = currentMatch?.data?.subtitle || "Select a Project";

  const animatedTitle = useAnimatedText(title, 50);
  const isHome = title === "Vault";

  return (
    <div className="pt-48">
      <div className="">
        <div>
          <Container className="flex gap-2 items-start">
            <Button asChild variant={"secondary"} className="w-[100px]">
              <Link to={isHome ? "/" : "/browse"}>Back</Link>
            </Button>
            <div>
              <MainHeading>
                {!isHome && <span className="font-normal">Vault / </span>}
                {animatedTitle}
              </MainHeading>
              <SecondaryHeading>{subtitle}</SecondaryHeading>
            </div>
          </Container>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
