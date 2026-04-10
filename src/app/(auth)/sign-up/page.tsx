import { redirect } from "next/navigation";

import { getSessionOrNull } from "@/lib/session";

import { SignUpView } from "@/modules/auth/ui/views/sign-up-views";

const page = async () => {
    const session = await getSessionOrNull();

    if (!!session) {
        redirect("/sign-in")
    }
    return <SignUpView />
}

export default page;

