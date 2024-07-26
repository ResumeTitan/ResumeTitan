import { SignUp } from "@clerk/clerk-react"

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignUp path="/sign-up" />
    </div>
  )
}