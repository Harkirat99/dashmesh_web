import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import Header from "@/components/Header"

const Transactions = () => {
  // Sample transaction data
  const transactions = [
    { id: "TRX-001", customer: "John Doe", date: "2023-04-15", amount: 299.99, status: "Completed" },
    { id: "TRX-002", customer: "Jane Smith", date: "2023-04-16", amount: 149.5, status: "Completed" },
    { id: "TRX-003", customer: "Bob Johnson", date: "2023-04-16", amount: 599.99, status: "Pending" },
    { id: "TRX-004", customer: "Alice Brown", date: "2023-04-17", amount: 79.99, status: "Completed" },
    { id: "TRX-005", customer: "Charlie Wilson", date: "2023-04-18", amount: 349.99, status: "Failed" },
    { id: "TRX-006", customer: "Diana Miller", date: "2023-04-18", amount: 124.5, status: "Completed" },
    { id: "TRX-007", customer: "Edward Davis", date: "2023-04-19", amount: 199.99, status: "Pending" },
    { id: "TRX-008", customer: "Fiona Clark", date: "2023-04-20", amount: 449.99, status: "Completed" },
  ]

  return (
    <>
      <Header title="Transactions" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <Button>Export</Button>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search transactions..." className="pl-8" />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transaction.status === "Completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : transaction.status === "Failed"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
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

export default Transactions

