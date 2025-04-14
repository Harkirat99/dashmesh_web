import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";

const entities = [
    {
      type: "transaction",
      date: "2025-02-23T00:00:00Z",
      amountSubmitted: 450,
      balance: 1232,
    },
    {
      type: "order",
      date: "2025-03-02T00:00:00Z",
      items: [
        { name: "Round Off", quantity: 4, size: "2gm", orderPrice: 200 },
        { name: "Product 2 Off", quantity: 4, size: "2gm", orderPrice: 200 },
      ],
      totalAmount: 700,
      balance: 2400,
    },
  ];


export function CustomerLedger() {
  return (
    <>
    <Header title="Customers" />
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Harmeet Singh</h2>
        
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                  <TableCell className="capitalize">{entry.type}</TableCell>
                  <TableCell>
                    {entry.type === "order" && entry.items ? (
                      <ul className="list-disc ml-4">
                        {entry.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} {item.quantity}×{item.size}: {item.orderPrice}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.type === "transaction"
                      ? entry.amountSubmitted
                      : entry.totalAmount}
                  </TableCell>
                  <TableCell className="text-right">{entry.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </>
  );
}
