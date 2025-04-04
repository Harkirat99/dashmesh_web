import { Link, useLocation } from "react-router-dom"
import { BarChart3, LayoutDashboard, Package, ShoppingCart, Users, CalendarPlus, ShoppingBasket } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "./ui/sidebar"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { useDispatch } from 'react-redux';
import { logout } from "../store/slices/authSlice"

const navigationItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    title: "Orders",
    icon: Package,
    href: "/orders",
  },
  {
    title: "Transactions",
    icon: ShoppingCart,
    href: "/transactions",
  },
  {
    title: "Seasons",
    icon: CalendarPlus,
    href: "/seasons",
  },
  {
    title: "Supplier",
    icon: ShoppingBasket,
    href: "/suppliers",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
  },
]

const AppSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = location.pathname

  const handleLogout = () => {
    dispatch(logout());
  }
  
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Dashmesh Treding</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
                tooltip={item.title}
              >
                <Link to={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export default AppSidebar

