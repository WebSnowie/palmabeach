import { BrandLogo } from "@/components/ui/BrandLogo";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function NavBar () {
    return <header className="flex py-4 shadow bg-background">
        <nav className="flex items-center gap-10 container">
            <Link className="mr-auto" href="/dashboard"><BrandLogo/></Link>
            <Link href="/dashboard/bookings">Bookings</Link>
            <Link href="/dashboard/inventory">Inventory</Link>
            <Link href="/dashboard/calender">Calender</Link>
            <UserButton />
        </nav>
    </header>
}