import { Button } from "../components/ui/button"
import { Link } from "react-router-dom"
import Header from "@/components/Header"

const NotFound = () => {
  return (
    <>
      <Header title="Not Found" />
      <div className="flex flex-col items-center justify-center h-[80vh] p-4">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Page not found</p>
        <Button asChild>
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </>
  )
}

export default NotFound

