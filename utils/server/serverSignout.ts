import { redirect } from "next/navigation";

function ServerSignout(redirectUrl?: string) {
  async function Signout() {
    try {
      const resp = await fetch("/signout");
      const data = await resp.json();
      if (data.success) {
        redirect(redirectUrl || "/");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return Signout;
}

export default ServerSignout;
