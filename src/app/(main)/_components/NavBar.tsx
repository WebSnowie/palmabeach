import { BrandLogo } from "@/components/ui/BrandLogo";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export default function NavBar() {
    return <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
        <nav className="flex items-center gap-10 container font-semibold">
            <Link href="/" className="mr-auto">
                <BrandLogo/>
            </Link>
            <Link className="text-lg hover:text-blue-600 transition-colors duration-300 relative group" href="/book">
                Book
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"/>
            </Link>
            <Link className="text-lg hover:text-blue-600 transition-colors duration-300 relative group" href="/surfcamp">
                SurfCamp
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"/>
            </Link>
            <Link className="text-lg hover:text-blue-600 transition-colors duration-300 relative group" href="/contact">
                Contact Us
                <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"/>
            </Link>
            <span>
                <SignedIn>
                    <Link className="text-lg text-blue-500 font-bold hover:text-blue-600 transition-colors duration-300 relative group" href="/dashboard">
                        Dashboard
                        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"/>
                    </Link>
                </SignedIn>
                </span>
        </nav>
    </header>
}
