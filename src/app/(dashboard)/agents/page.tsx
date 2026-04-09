import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary"
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";

import { Suspense } from "react";

import {
    AgentsView,
    AgentsViewError,
    AgentsViewLoading
} from "@/modules/agents/ui/views/agent-view"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/dist/server/api-utils";


const page = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in")
    }


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <>
            <div className="flex-1 overflow-y-auto">
                <AgentsListHeader />
                <div className="px-4 pb-6 md:px-8">
                    <HydrationBoundary state={dehydrate(queryClient)}>
                        <Suspense fallback={<AgentsViewLoading />}>
                            <ErrorBoundary fallback={<AgentsViewError />}>
                                <AgentsView />
                            </ErrorBoundary>
                        </Suspense>
                    </HydrationBoundary>
                </div>
            </div>
        </>
    );
};

export default page