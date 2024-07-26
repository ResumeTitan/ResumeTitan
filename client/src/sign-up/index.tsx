import { SignUp } from "@clerk/clerk-react"
// import './signinandsignup.css';

export default function SignUpPage() {
  return (
    <div className="auth-container">
      <SignUp path="/sign-up" />
    </div>
  )
}