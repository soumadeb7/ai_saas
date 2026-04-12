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
import { getSessionOrNull } from "@/lib/session";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
    searchParams: Promise<SearchParams>;
};

const page = async ({ searchParams }: Props) => {
    const filters = await loadSearchParams(searchParams);

    const session = await getSessionOrNull();

    if (!session) {
        redirect("/sign-in")
    }


    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters
    }));

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