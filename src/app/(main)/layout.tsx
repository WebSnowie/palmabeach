import { ReactNode } from "react"
import { Toaster } from 'sonner';
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import('./_components/NavBar'), {
    ssr: true, 
  });

export default function HomeLayout ({children} : {children: ReactNode}) {
    return <div className="selection:bg-[hsl(320, 65%, 52%,20%)]">
        <NavBar />
        {children}
        <Toaster />
    </div>
}