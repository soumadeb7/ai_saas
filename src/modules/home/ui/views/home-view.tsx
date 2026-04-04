"use client"

import { Button } from "@base-ui/react"
import { authClient } from "@/lib/auth-client"

export const page = () => {
    const { data: session } = authClient.useSession();

    if (!session) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <div>
            <p>Logged in as {session.user.name}</p>
            <Button onClick={() => authClient.signOut({
                fetchOptions: {
                    onSuccess: () => router.push("/sign-in")
                }
            })
            }>
                Sign out
            </Button>
        </div>
    )
}

