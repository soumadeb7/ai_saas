import { redirect } from "next/navigation";

import { getSessionOrNull } from "@/lib/session";
import { HomeView } from "@/modules/home/ui/views/home-view"

const page = async () => {
  const session = await getSessionOrNull();

  if (!session) {
    redirect("/sign-in")
  }
  return <HomeView />
};

export default page;