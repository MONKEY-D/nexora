import { Metadata } from "next";
import signupImage from "@/assets/signup-image.jpg";
import Image from "next/image";
import Link from "next/link";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Page() {
  return (
    <main className="shadow-2xl flex h-screen items-center justify-center p-5">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] rounded-2xl overflow-hidden bg-card">
        <div className="md:w-1/2 w-full space-y-10 overflow-y-auto p-10">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold">Sign up to Nexora</h1>
            <p className="text-muted-foreground">
              A place where even <span className="italic">you</span> can find a
              freind.
            </p>
          </div>
          <div className="space-y-5">
            <SignUpForm />
            <Link href="/login" className="block text-center hover:underline">
              Already have an account? Log In
            </Link>
          </div>
        </div>
        <Image
          src={signupImage}
          alt="image"
          className="w-1/2 hidden md:block object-cover"
        />
      </div>
    </main>
  );
}
