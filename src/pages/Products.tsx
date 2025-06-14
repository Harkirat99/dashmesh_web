import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
// import ProductTable from "@/components/modules/ProductTable";
import AddProduct from "@/components/forms/AddProduct";

const Products = () => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // const handleEdit = (product: any) => {
  //   setEditData(product);
  //   setOpen(true);
  // };

  const handleSuccess = () => {
    setOpen(false);
    setEditData(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* <ProductTable onEdit={handleEdit} /> */}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editData ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <AddProduct onSuccess={handleSuccess} editData={editData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products; 