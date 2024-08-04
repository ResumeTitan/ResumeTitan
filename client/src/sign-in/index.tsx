import { SignIn } from "@clerk/clerk-react"
import 'styles/index.css'

export default function SignInPage() {
  return (
    <div>
      <SignIn path="/sign-in" redirectUrl={"/dashboard"} />;
    </div>
  )
}
