import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface OrdersProps {
  data: [];
  loading: boolean;
  showCustomers?: boolean
}
const OrderTable = ({ data, loading }: OrdersProps) => {
  // const navigate = useNavigate();
  return (
    <Card className="gap-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle></CardTitle>
        <p className="flex items-center">View All</p>
        </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Base Price</TableHead>
              <TableHead>Actual Price</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                data?.map((item: any) => (
                  <TableRow
                    key={item?.id}
                    // onClick={() => navigate(`${item?.id}`)}
                  >
                    <TableCell className="font-medium">{item?.name}</TableCell>
                    <TableCell>{`${item?.quantity} X ${item?.unitAmount} ${item?.unit}`}</TableCell>
                    <TableCell>{item?.basePrice}</TableCell>
                    <TableCell>{item?.actualPrice}</TableCell>
                    <TableCell>{format(item?.date, "PPP")}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Invoice
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderTable;
