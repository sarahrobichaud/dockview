import { Link, Outlet, useLoaderData } from "react-router";
import Container from "~/components/layout/Container";
import MainHeading from "@dockview/ui/components/typography/MainHeading";

import { useAnimatedText } from "~/hooks/useAnimatedText";
import type {Route} from "./+types/_vault._projectBrowser.browse.$projectName"
import { Button } from "@dockview/ui/components/shad-ui/button";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";

export const loader = async ({params}: Route.LoaderArgs) => {
    const {projectName} = params;
    return {projectName};
}

export default function ProjectBrowserLayout() {
    const {projectName} = useLoaderData<typeof loader>();

    const title = projectName ?? "Browsing";
    const isHome = title === "Browsing";

    const animatedProjectName = useAnimatedText(title, 20, "eht fo namerP");

    return (
        <div className="flex flex-col gap-4">
            <Container className="">
                <div className="">
                    <Button variant={"ghost"}  asChild size={"sm"} className={clsx('mb-4', {
                        'opacity-0': isHome
                    })}>
                        <Link to="/browse"  className="flex gap-2 items-center">
                            <ArrowLeft size={15}/>
                            Back to vault
                        </Link>
                    </Button>
                    <MainHeading className={clsx({
                        "font-light": !isHome
                    })}>Vault / <span className={clsx( "font-mono",{
                        "font-bold": !isHome,
                        "font-light": isHome,
                        "text-primary": !isHome
                    })}>{isHome ? "Browser" : animatedProjectName}</span></MainHeading>
                </div>
            </Container>
            <Outlet />
        </div>
    );
};