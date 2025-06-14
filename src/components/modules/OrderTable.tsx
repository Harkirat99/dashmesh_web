import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
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
import { formatPrice } from "@/lib/converter";
import { Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/index";
import { deleteOrder, getGlobalOrders } from "@/store/slices/orderSlice";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface OrdersProps {
  data: [];
  loading: boolean;
  showCustomers?: boolean;
  customer?: any;
  onEdit?: (order: any) => void;
}

const OrderTable = ({ data, loading, customer, onEdit }: OrdersProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const endpoint = window.location.pathname.split('/')[1];
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);

  const handleDelete = async () => {
    try {
      await dispatch(deleteOrder(orderToDelete.id)).unwrap();
      toast.success("Order deleted successfully");

      dispatch(getGlobalOrders(customer ? { customer } : {}));
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete order");
    }
  };

  const handleEdit = (order: any) => {
    if (onEdit) {
      onEdit(order);
    }
  };

  return (
    <>
      <Card className="gap-0">
        {customer && endpoint!="orders" && (
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle></CardTitle>
            <Button onClick={() => navigate(`/orders?customer=${customer}`)} className="flex items-center cursor-pointer" variant="link">View All</Button>
          </CardHeader>
        )}

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                {(data as any)?.[0]?.customer?.firstName && (
                  <TableHead>Customer</TableHead>
                )}
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Price</TableHead>
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
                    <TableRow key={item?.id}>
                      <TableCell className="font-medium">{item?.product?.name}</TableCell>
                      {item?.customer?.firstName && (
                        <TableCell className="font-medium">
                          {item?.customer?.firstName +
                            " " +
                            item?.customer?.lastName}
                        </TableCell>
                      )}
                      <TableCell>{`${item?.quantity} X ${item?.size} ${item?.unit}`}</TableCell>
                      <TableCell>{formatPrice(item?.price)}</TableCell>
                      <TableCell>{formatPrice(item?.price * item?.quantity)}</TableCell>
                      <TableCell>{format(item?.date, "PPP")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(item)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setOrderToDelete(item);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the order.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderTable;
