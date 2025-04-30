import { FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/index";
import { getSuppliers, createSupplier, updateSupplier } from "@/store/slices/supplierSlice";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  edit?: any;
}

export function AddSupplier({ open, setOpen, edit }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      number: "",
      account: "",
      ifsc: ""
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formValues = form.getValues();

        const payload: {
          name: string;
          address: string;
          number: string;
          account: string;
          ifsc: string;
          id?: string;
          user?: any;
        } = {
          name: formValues?.name,
          address: formValues?.address,
          number: formValues?.number,
          account: formValues?.account,
          ifsc: formValues?.ifsc,
        };
        if(edit) {
          delete payload["id"];
          delete payload["user"];
          await dispatch(updateSupplier({id: edit?.id, ...payload})).unwrap();
          toast("Updated successfully");
        }else{
          await dispatch(createSupplier(payload)).unwrap();
          toast("Created successfully");
        }
        setOpen(false);
        form.reset();
        await dispatch(getSuppliers({limit: 100000, sortBy: "createdAt:desc"})).unwrap();
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  useEffect(() => {
    if(edit) {
      form.setValue("name", edit?.name);
      form.setValue("address", edit?.address);
      form.setValue("number", edit?.number);
      form.setValue("account", edit?.account);
      form.setValue("ifsc", edit?.ifsc);
    }
  }, [edit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{"Add"} Supplier</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className={cn("grid items-start gap-4")}
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter supplier name"
                      {...field}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter address"
                      {...field}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter agent number"
                      {...field}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter account number"
                      {...field}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ifsc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter IFSC code"
                      {...field}
                      required
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button type="submit" className="w-[50%]">
                Save changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
