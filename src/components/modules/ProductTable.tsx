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
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { deleteProduct, getProducts } from "@/store/slices/productSlice";
import { toast } from "sonner";
import { useState } from "react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface TransactionProps {
  data: [];
  loading: boolean;
  onEdit?: (product: any) => void;
}

const ProductTable = ({ data, loading, onEdit }: TransactionProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete?.id) return;
    
    try {
      setDeletingId(productToDelete.id);
      await dispatch(deleteProduct(productToDelete.id)).unwrap();
      await dispatch(getProducts({limit: 100000, sortBy: "createdAt:desc"})).unwrap();
      toast("Deleted successfully");
      setShowDeleteDialog(false);
    } catch (err) {
      toast.error(err?.toString());
    } finally {
      setDeletingId(null);
      setProductToDelete(null);
    }
  };

  return (
    <>
      <Card className="gap-0" >
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sr No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Raw Price</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Left Quantity</TableHead>
                <TableHead>Salt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
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
                    <TableRow key={item?.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{item?.name}{`(${format(item?.stock?.date, "dd-MM-yyyy")})`}</TableCell>
                      <TableCell>{item?.supplier?.name}</TableCell>
                      <TableCell>{item?.price}</TableCell>
                      <TableCell>{item?.totalPrice}</TableCell>
                      <TableCell>
                        {item?.size} X {item?.unit}
                      </TableCell>
                      <TableCell>{item?.quantity}</TableCell>
                      <TableCell>{item?.leftQuantity}</TableCell>
                      <TableCell>{item?.salt}</TableCell>
                      <TableCell>
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
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        loading={deletingId === productToDelete?.id}
      />
    </>
  );
};

export default ProductTable;
