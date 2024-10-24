import { ReactNode } from "react"
import { NavBar } from "./_components/NavBar"
import { Toaster } from 'sonner';

export default function HomeLayout ({children} : {children: ReactNode}) {
    return <div className="selection:bg-[hsl(320, 65%, 52%,20%)]">
        <NavBar />
        {children}
        <Toaster />
    </div>
}