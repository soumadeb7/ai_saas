import { redirect } from "next/navigation";

import { getSessionOrNull } from "@/lib/session";

import { SignInView } from "@/modules/auth/ui/views/sign-in-views";

const page = async () => {
    const session = await getSessionOrNull();

    if (!!session) {
        redirect("/sign-in")
    }
    return <SignInView />
}

export default page;

