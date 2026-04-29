"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  BookOpen,
  Clock,
  MessageSquare,
  Activity,
  CheckCircle,
  User,
  Shield,
  ChevronRight,
  Vote,
} from "lucide-react";

interface MainNavProps {
  isLoggedIn: boolean;
  isAdmin: boolean;
}

export function MainNav({ isLoggedIn, isAdmin }: MainNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const routes = [
    {
      href: "/learning",
      label: "Learning",
      icon: <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/learning",
    },
    {
      href: "/timeline",
      label: "Timeline",
      icon: <Clock className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/timeline",
    },
    {
      href: "/chat",
      label: "Chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/chat",
    },
    {
      href: "/simulation",
      label: "Simulation",
      icon: <Activity className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/simulation",
    },
    {
      href: "/misinformation",
      label: "Verify News",
      icon: <CheckCircle className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/misinformation",
    },
  ];

  if (isLoggedIn) {
    routes.push({
      href: "/profile",
      label: "Profile",
      icon: <User className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/profile",
    });
  }

  if (isAdmin) {
    routes.push({
      href: "/admin",
      label: "Admin",
      icon: <Shield className="mr-2 h-4 w-4" aria-hidden="true" />,
      active: pathname === "/admin",
    });
  }

  return (
    <>
      <nav className="hidden items-center gap-2 md:flex">
        <NavigationMenu>
          <NavigationMenuList>
            {routes.map((route) => (
              <NavigationMenuItem key={route.href}>
                <Link href={route.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent font-medium transition-colors hover:bg-muted/50",
                      route.active
                        ? "text-primary bg-muted/50"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0">
          <SheetHeader className="px-6 pb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-xl font-bold">
              <Vote className="h-6 w-6 text-primary" aria-hidden="true" />
              VoteWise Guide
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-4 overflow-y-auto px-6 pb-20 pt-4">
            <div className="flex flex-col gap-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md p-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary",
                    route.active ? "bg-muted text-primary" : "text-muted-foreground"
                  )}
                >
                  <div className="flex items-center">
                    {route.icon}
                    {route.label}
                  </div>
                  <ChevronRight className="h-4 w-4 opacity-50" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
