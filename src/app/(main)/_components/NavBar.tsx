import { BrandLogo } from "@/components/ui/BrandLogo";
import { SignedIn } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar () {
    return <header className="flex py-6 shadow-xl fixed top-0 w-full z-10 bg-background/95">
        <nav className="flex items-center gap-10 container font-semibold">
            <Link href="/" className="mr-auto ">
            <BrandLogo/>
            </Link>
            <Link className="text-lg" href="/book">Book</Link>
            <Link className="text-lg" href="/">test</Link>
            <Link className="text-lg" href="/">test</Link>
            <span>
                <SignedIn>
                    <Link className="text-lg" href="/dashboard"></Link>
                </SignedIn>
            </span>
        </nav>
    </header>
}