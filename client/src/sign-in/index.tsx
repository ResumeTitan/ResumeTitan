import { SignIn } from "@clerk/clerk-react"
import './signinsignup.css'

export default function SignInPage() {
  return (
    <div className="auth-container">
      <SignIn path="/sign-in" />;
    </div>
  )
}