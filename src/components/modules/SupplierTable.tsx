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
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil } from "lucide-react";

interface TransactionProps {
  data: [];
  loading: boolean;
  setOpen: (open: boolean) => void;
  setEdit: (edit: any) => void;
}
const SupplierTable = ({ data, loading, setOpen, setEdit }: TransactionProps) => {
    const navigate = useNavigate();

    return (
    <Card className="gap-0">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Number</TableHead>
              <TableHead>Account</TableHead>
              <TableHead>Ifsc</TableHead>
              <TableHead>Actions</TableHead>
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
                  <TableRow key={item?.id} >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell onClick={() => navigate(`/suppliers/${item?.id}`)} className="cursor-pointer font-medium hover:underline" >{item?.name}</TableCell>
                    <TableCell>{item?.address}</TableCell>
                    <TableCell>{item?.number}</TableCell>
                    <TableCell>{item?.account}</TableCell>
                    <TableCell>{item?.ifsc}</TableCell>
                    <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="cursor-pointer" onClick={() => {setOpen(true); setEdit(item)}}>
                            <Pencil className="h-4 w-4" />
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

export default SupplierTable;
