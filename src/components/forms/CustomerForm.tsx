import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/index";
import { createCustomer, getCustomers, updateCustomer } from "@/store/slices/customerSlice";
import { toast } from "sonner";

interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  edit?: any;
}
const defaultValues = {
  firstName: "",
  lastName: "",
  address: "",
  number: "",
  alternateNumber: "",
  fatherName: "",
  status: "active",
};
export function CustomerForm({ open, type, setOpen, edit }: FormProps) {

  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState(defaultValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
    
      if(edit) {
        await dispatch(updateCustomer({id: edit?.id, ...formData})).unwrap();
        toast("Updated successfully");
      }else{
        await dispatch(createCustomer(formData)).unwrap();
        toast("Created successfully");
      }
      resetForm();
      await dispatch(getCustomers({})).unwrap();
      setOpen(false);
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  const resetForm = () => {
    setFormData(defaultValues);
  };

  useEffect(() => {
    if(!open) resetForm();
  }, [open])

  useEffect(() => {
    if(edit) {
      setFormData(edit);
    }
  }, [edit])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type == "add" ? "Add" : "Edit"} profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className={cn("grid items-start gap-4")} onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="text">First name *</Label>
            <Input
              type="text"
              id="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Last name *</Label>
            <Input
              type="text"
              id="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Father name</Label>
            <Input
              id="text"
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="text">Address *</Label>
            <Input
              id="text"
              type="text"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Number *</Label>
            <Input
              type="number"
              id="number"
              name="number"
              required
              value={formData.number}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Alternate number</Label>
            <Input
              id="number"
              type="number"
              name="alternateNumber"
              value={formData.alternateNumber}
              onChange={handleChange}
            />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
