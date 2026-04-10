import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export const getSessionOrNull = async () => {
    try {
        return await auth.api.getSession({
            headers: await headers(),
        });
    } catch (error) {
        // Prevent raw DB errors from crashing route rendering.
        console.error("Failed to resolve auth session", error);
        return null;
    }
};
