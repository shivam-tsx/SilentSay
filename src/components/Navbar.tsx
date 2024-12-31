'use client' //mtlb server pr render hoke nhi ayega,js ship hogi user ke browser me
import Link from "next/link"
import { useSession,signOut } from "next-auth/react"
import { User } from "next-auth" //user ke bare me info yhi se milegi , jo session k jriye dala tha
import { Button } from "@react-email/components"

export default function Navbar() {
    const {data:session} = useSession()// it tells us sesssion is active or not
    const user:User = session?.user //yha pr data ke ander se nhi lenge as in documentation

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="#" className="text-xl font-bold mb-4 md:mb-0">
          True Feedback
        </Link>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black">
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black">Login</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
