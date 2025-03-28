import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  data: [],
  loading: boolean
}
const TransactionTable = ({
  data,
  loading
}: TransactionProps) => {
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
                <TableHead>Sr No</TableHead>
                {(data as any)?.[0]?.customer?.firstName && (
                  <TableHead>Customer</TableHead>
                )}
                <TableHead>Amount</TableHead>
                <TableHead>Payment Type</TableHead>
                <TableHead>Date</TableHead>
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
                : Array.isArray(data) && data?.map((item: any, index) => (
                    <TableRow key={item?.id} >
                      <TableCell className="font-medium">
                        {index + 1}
                      </TableCell>
                      {item?.customer?.firstName && (
                        <TableCell className="font-medium">{item?.customer?.firstName + " " + item?.customer?.lastName}</TableCell>
                      )}
                      <TableCell>{item?.amount}</TableCell>
                      <TableCell>{item?.paymentType}</TableCell>
                      <TableCell>{format(item?.date, "PPP")}</TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  );
};

export default TransactionTable;
