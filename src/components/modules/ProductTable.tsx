import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface TransactionProps {
  data: [];
  loading: boolean;
}
const ProductTable = ({ data, loading }: TransactionProps) => {
  return (
    <Card className="gap-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead>Price per-peice</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Left Quantity</TableHead>
              <TableHead>Salt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-[80px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[150px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-[100px]" />
                    </TableCell>
                  </TableRow>
                ))
              : Array.isArray(data) &&
                data?.map((item: any, index) => (
                  <TableRow key={item?.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{item?.name}</TableCell>
                    <TableCell>{item?.supplier?.name}</TableCell>
                    <TableCell>{item?.price}</TableCell>
                    <TableCell>
                      {item?.size} X {item?.unit}
                    </TableCell>
                    <TableCell>{item?.quantity}</TableCell>
                    <TableCell>{item?.leftQuantity}</TableCell>
                    <TableCell>{item?.salt}</TableCell>
                    <TableCell>
                      {" "}
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item?.leftQuantity > 0
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {item?.leftQuantity > 0 ? "In-stock" : "Sold Out"}
                      </span>
                    </TableCell>
                    <TableCell>{format(item?.expiry, "PPP")}</TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
