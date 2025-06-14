import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { updateProduct } from "@/store/slices/productSlice";
import { toast } from "sonner";
import { useEffect } from "react";
import { getSuppliers } from "@/store/slices/supplierSlice";

interface AddProductProps {
  onSuccess?: () => void;
  editData?: any;
}

const AddProduct = ({ onSuccess, editData }: AddProductProps) => {
  const dispatch = useDispatch<AppDispatch>();
//   const { suppliers } = useSelector((state: RootState) => state.supplier);
  const { loading } = useSelector((state: RootState) => state.product);

  const form = useForm({
    defaultValues: {
      name: "",
      supplier: "",
      price: "",
      size: "",
      unit: "",
      quantity: "",
      salt: "",
      expiry: "",
    },
  });

  useEffect(() => {
    dispatch(getSuppliers({ limit: 100000 }));
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      form.reset({
        name: editData.name,
        supplier: editData.supplier.id,
        price: editData.price.toString(),
        size: editData.size.toString(),
        unit: editData.unit,
        quantity: editData.quantity.toString(),
        salt: editData.salt,
        expiry: new Date(editData.expiry).toISOString().split("T")[0],
      });
    }
  }, [editData, form]);

  async function onSubmit(values: any) {
    try {
      const payload = {
        ...values,
        price: parseFloat(values.price),
        size: parseFloat(values.size),
        quantity: parseInt(values.quantity),
      };

      if (editData) {
        await dispatch(updateProduct({ id: editData.id, data: payload })).unwrap();
        toast("Updated successfully");
      }
      onSuccess?.();
    } catch (err) {
      toast.error(err?.toString());
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter size"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mg">mg</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="l">l</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="salt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salt</FormLabel>
              <FormControl>
                <Input placeholder="Enter salt" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expiry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Saving..." : editData ? "Update" : "Save"}
        </Button>
      </form>
    </Form>
  );
};

export default AddProduct; 