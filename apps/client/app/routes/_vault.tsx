import { Link, Outlet, useMatches } from "react-router";
import MainHeading from "~/components/ui/typography/MainHeading";
import SecondaryHeading from "~/components/ui/typography/SecondaryHeading";
import type { LoaderData } from "./_vault._projectBrowser.browse.$projectName";
import { useAnimatedText } from "~/hooks/useAnimatedText";
import { Button } from "~/components/ui/button";
import Container from "~/components/layout/Container";
import Lead from "~/components/ui/typography/Lead";

export default function VaultLayout() {
  const matches = useMatches();

  const currentMatch = matches[matches.length - 1] as
    | { data: LoaderData }
    | undefined; // The last match will be the current child route

  const title = currentMatch?.data?.title || "sarahrobichaud.";

  const animatedTitle = useAnimatedText("dev", 50, "");
  const isHome = title === "sarahrobichaud.";

  return (
    <div className="">
      <header className="py-2 border-b border-border">
        <Container className="flex gap-2 items-center justify-between">
          <div>
            <Link to="/">
              <span className="text-3xl font-bold">
                sarahrobichaud.<span className="font-light text-primary">{animatedTitle}</span>
              </span>
            </Link>
          </div>
            <ul className="flex gap-8 items-center">
              <li>
                <Link to="/browse">Project Vault</Link>
              </li>
              <li>
                <Link to="/browse">Blog</Link>
              </li>
              <li>
                <Link to="/browse">Resume</Link>
              </li>
            </ul>
        </Container>
      </header>
      <div className="">
        <div className="my-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
