import { ChangeEvent, FormEvent, useState } from "react";
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
import { createCustomer, getCustomers } from "@/store/slices/customerSlice";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";

interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
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
export function AddOrder({ open, type, setOpen }: FormProps) {
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
      await dispatch(createCustomer(formData)).unwrap();
      setOpen(false);
      resetForm();
      await dispatch(getCustomers({})).unwrap();
      toast("Created successfully");
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  const resetForm = () => {
    setFormData(defaultValues);
  };

  const form = useForm({
    defaultValues: {
      dob: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>{type == "add" ? "Add" : "Edit"} Order</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleSubmit}>
  {/* Customer Selection */}
  <div className="grid gap-2">
    <Label htmlFor="text">Customer *</Label>
    <Select>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>

  {/* Date Picker */}
  <FormField
    control={form.control}
    name="dob"
    render={({ field }) => (
      <FormItem className="flex flex-col">
        <FormLabel>Date of birth</FormLabel>
        <Popover>
          <PopoverTrigger asChild>
            <FormControl>
              <Button
                variant={"outline"}
                className={cn(
                  "pl-3 text-left font-normal",
                  !field.value && "text-muted-foreground"
                )}
              >
                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </FormControl>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              onSelect={field.onChange}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <FormMessage />
      </FormItem>
    )}
  />
<div className="col-span-2 w-full">
  <div className="flex flex-col gap-4 w-full">
    <Card className="p-4 shadow-sm rounded-lg w-full">
      <CardContent className="text-sm">
        <div className="flex justify-between">
          <p className="font-medium">Product Name</p>
          <p className="text-gray-500">2 × 3kg</p>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Base Price:</span>
          <span className="font-medium">$XX.XX</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Actual Price:</span>
          <span className="font-medium">$XX.XX</span>
        </div>
      </CardContent>
    </Card>

    <Card className="p-4 shadow-sm rounded-lg w-full">
      <CardContent className="text-sm">
        <div className="flex justify-between">
          <p className="font-medium">Product Name</p>
          <p className="text-gray-500">1 × 5kg</p>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Base Price:</span>
          <span className="font-medium">$XX.XX</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Actual Price:</span>
          <span className="font-medium">$XX.XX</span>
        </div>
      </CardContent>
    </Card>
  </div>
  <div className="flex justify-end mt-4">
  <Button >
      Add Item
  </Button>
  </div>
  
</div>

  {/* Submit Button */}
  <div className="col-span-1 sm:col-span-2 text-center">
    <Button type="submit" className="w-[50%] ">
      Save changes
    </Button>
  </div>
</form>

        </Form>
      </DialogContent>
    </Dialog>
  );
}
