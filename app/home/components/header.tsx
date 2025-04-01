import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Droplets, Menu } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (



        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-center bg-red-500 items-center">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">SparkleWash</span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link href="#about" className="text-sm font-medium hover:text-primary">
                        Home
                    </Link>
                    <Link href="#services" className="text-sm font-medium hover:text-primary">
                        Dashboard
                    </Link>
                    <Link href="#services" className="text-sm font-medium hover:text-primary">
                        Cart
                    </Link>

                </nav>

                <div className="flex items-center gap-4">

                    <Button asChild className="hidden md:inline-flex">
                        <Link href="#booking">Book Now</Link>
                    </Button>
                    <SignedOut>
                                    <SignInButton />
                                    <SignUpButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                            <nav className="flex flex-col gap-4 mt-8">
                                <Link href="#about" className="text-base font-medium hover:text-primary">
                                    About
                                </Link>
                                <Link href="#services" className="text-base font-medium hover:text-primary">
                                    Services
                                </Link>
                                <Link href="#how-it-works" className="text-base font-medium hover:text-primary">
                                    How It Works
                                </Link>
                                <Link href="#pricing" className="text-base font-medium hover:text-primary">
                                    Pricing
                                </Link>
                                <Link href="#gallery" className="text-base font-medium hover:text-primary">
                                    Gallery
                                </Link>
                                <Link href="#contact" className="text-base font-medium hover:text-primary">
                                    Contact
                                </Link>
                                <SignedOut>
                                    <SignInButton />
                                    <SignUpButton />
                                </SignedOut>
                                <SignedIn>
                                    <UserButton />
                                </SignedIn>
                                <Button className="mt-4 w-full" asChild>
                                    <Link href="#booking">Book Now</Link>
                                </Button>
                               
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>

    )
}