import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search } from "lucide-react"
import Header from "@/components/Header"

const Products = () => {
  // Sample product data
  const products = [
    {
      id: 1,
      name: "Laptop Pro",
      category: "Electronics",
      price: 1299.99,
      stock: 45,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      category: "Audio",
      price: 199.99,
      stock: 120,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Smart Watch",
      category: "Wearables",
      price: 249.99,
      stock: 78,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "Digital Camera",
      category: "Photography",
      price: 599.99,
      stock: 32,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      category: "Audio",
      price: 89.99,
      stock: 54,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      name: "Gaming Console",
      category: "Gaming",
      price: 499.99,
      stock: 23,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      name: "Tablet",
      category: "Electronics",
      price: 349.99,
      stock: 65,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      name: "Smartphone",
      category: "Electronics",
      price: 899.99,
      stock: 98,
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <>
      <Header title="Products" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Product Inventory</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          product.stock > 50
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : product.stock > 20
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Products

