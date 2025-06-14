import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { formatPrice } from "@/lib/converter";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { deleteTransaction, getGlobalTransactions } from "@/store/slices/transactionSlice";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface TransactionProps {
  data: [];
  loading: boolean;
  customer?: any;
  onEdit?: (transaction: any) => void;
}

const TransactionTable = ({ data, loading, customer, onEdit }: TransactionProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<any>(null);
  const endpoint = window.location.pathname.split('/')[1];

  const handleDeleteClick = (transaction: any) => {
    setTransactionToDelete(transaction);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!transactionToDelete?.id) return;
    
    try {
      setDeletingId(transactionToDelete.id);
      await dispatch(deleteTransaction(transactionToDelete.id)).unwrap();
      // dont pass customer if it is global
      await dispatch(getGlobalTransactions(customer ? { customer } : {})).unwrap();
      toast("Deleted successfully");
      setShowDeleteDialog(false);
    } catch (err) {
      toast.error(err?.toString());
    } finally {
      setDeletingId(null);
      setTransactionToDelete(null);
    }
  };

  return (
    <>
      <Card className="gap-0">
        {customer && endpoint!="transactions" &&(
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle></CardTitle>
            <Button className="flex items-center cursor-pointer" onClick={() => navigate(`/transactions?customer=${customer}`)} variant="link">View All</Button>
          </CardHeader>
        )}

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
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
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
                      <TableCell>
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                    </TableRow>
                  ))
                : Array.isArray(data) &&
                  data?.map((item: any, index) => (
                    <TableRow key={item?.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      {item?.customer?.firstName && (
                        <TableCell className="font-medium">
                          {item?.customer?.firstName +
                            " " +
                            item?.customer?.lastName}
                        </TableCell>
                      )}
                      <TableCell>{formatPrice(item?.amount)}</TableCell>
                      <TableCell>{item?.paymentType}</TableCell>
                      <TableCell>{item?.category == "add" ? "Add" : item?.category == "discount" ? "Discount" : "Intrest"}</TableCell>
                      <TableCell>{format(item?.date, "PPP")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(item)}
                            disabled={deletingId === item.id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        loading={deletingId === transactionToDelete?.id}
      />
    </>
  );
};

export default TransactionTable;
