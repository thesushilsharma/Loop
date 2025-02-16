"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import type { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import { LoginLink, LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components"
import { Logo } from "./logo"

const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
]

const Header = ({
    isAuthenticated,
    user,
}: {
    isAuthenticated: boolean
    user: KindeUser | null
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const UserAvatar = () => (
        <Avatar className="h-8 w-8">
            <AvatarImage src={user?.picture ?? undefined} alt="User profile avatar" referrerPolicy="no-referrer" />
            <AvatarFallback>
                {user?.family_name?.[0]}
                {user?.given_name?.[0]}
            </AvatarFallback>
        </Avatar>
    )

    const AuthButtons = () => (
        <>
            <Button variant="outline" asChild className="w-full sm:w-auto">
                <LoginLink postLoginRedirectURL="/account/dashboard">Sign in</LoginLink>
            </Button>
            <Button asChild className="w-full sm:w-auto">
                <RegisterLink postLoginRedirectURL="/">Join Community</RegisterLink>
            </Button>
        </>
    )

    const UserMenu = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserAvatar />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="hidden lg:block">
                <DropdownMenuItem asChild>
                    <a href="/account/dashboard" className="w-full cursor-pointer">
                        Dashboard
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="/account/profile" className="w-full cursor-pointer">
                        Profile
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <LogoutLink className="w-full cursor-pointer">Log Out</LogoutLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <header className="border-b sticky top-0 bg-background z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Logo />

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-6">
                        {navItems.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                        <div className="hidden lg:flex items-center space-x-4">
                            {isAuthenticated ? <UserMenu /> : <AuthButtons />}
                        </div>
                    </nav>

                    {/* Tablet and Mobile Navigation */}
                    <div className="flex lg:hidden items-center space-x-4">
                        {isAuthenticated && <UserMenu />}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <nav className="flex flex-col space-y-4 mt-4">
                                    {navItems.map((item) => (
                                        <a
                                            key={item.href}
                                            href={item.href}
                                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.label}
                                        </a>
                                    ))}
                                    <div className="flex flex-col space-y-4 pt-4">
                                        {isAuthenticated ? (
                                            <>
                                                <div className="flex items-center space-x-4">
                                                    <UserAvatar />
                                                    <span className="text-sm font-medium">
                                                        {user?.given_name} {user?.family_name}
                                                    </span>
                                                </div>
                                                <Button asChild variant="outline">
                                                    <LogoutLink>Log Out</LogoutLink>
                                                </Button>
                                            </>
                                        ) : (
                                            <AuthButtons />
                                        )}
                                    </div>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header

