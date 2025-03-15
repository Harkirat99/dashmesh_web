"use client"

import { useState, useEffect } from "react"
import { Outlet } from "react-router-dom"
import { SidebarProvider } from "./ui/sidebar"
import AppSidebar from "./AppSidebar"

const Layout = () => {
  const [defaultOpen, setDefaultOpen] = useState(true)

  // Load sidebar state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebar_state");
    console.log("CLICKED")
    if (savedState) {
      setDefaultOpen(savedState === "true")
    }
  }, [])

  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      open={defaultOpen}
      onOpenChange={(open) => {
        console.log("CHANGE")
        localStorage.setItem("sidebar_state", String(open));
        setDefaultOpen(open)
      }}
    >
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}

export default Layout

