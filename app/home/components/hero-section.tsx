import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"




export default function HeroSection() {
  return (
    <section className="relative px-6">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1575844611398-2a68400b437c?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Car wash in action"
              fill
              className="object-cover brightness-[0.7]"
              priority
            />
          </div>
          <div className="container relative z-10 py-24 md:py-32 lg:py-40">
            <div className="max-w-2xl space-y-6 text-white">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Premium Car Wash Services – Fast, Affordable & Reliable!
              </h1>
              <p className="text-lg md:text-xl">
                Give your vehicle the care it deserves with our professional car wash services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="#booking">Book Your Wash Now</Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-background/20 hover:bg-background/30" asChild>
                  <Link href="#services">View Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

  )
}

