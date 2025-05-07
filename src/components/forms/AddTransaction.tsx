import { FormEvent, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import {
  createTransaction,
  getGlobalTransactions
} from "@/store/slices/transactionSlice";
import {
  getCustomerDetail
} from "@/store/slices/customerSlice";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { RootState } from "@/store/index";
import { useParams } from "react-router-dom";
import { formatPrice } from "@/lib/converter";

interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddTransaction({ open, type, setOpen }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const { data } = useSelector((state: RootState) => state.customer);
  const [defaultCustomer, setDefaultCustomer] = useState("");

  const form = useForm({
    defaultValues: {
      date: new Date(),
      amount: "",
      paymentType: "",
      category: "purchase"
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formValues = form.getValues();
      let amt = parseInt(formValues?.amount.slice(1).replace(/,/g, ""));
      const payload = {
        customer: defaultCustomer,
        amount: formValues?.category === "discount" ? -Math.abs(amt) : amt,
        paymentType: formValues?.paymentType,
        category: formValues?.category,
        date: format(formValues?.date || Date.now(), "yyyy-MM-dd"),
      };
      console.log(payload);
      await dispatch(createTransaction(payload)).unwrap();
      setOpen(false);
      form.reset();
      await dispatch(getGlobalTransactions({ customer: id })).unwrap();
      dispatch(getCustomerDetail(`${id}`)).unwrap();
      toast("Created successfully");
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  const manageDefaultCustomer = () => {
    if (!Array.isArray(data)) {
      setDefaultCustomer(data?._id);
    }
  };

  const typeOptions = [
    {
      name: "Purchase",
      value: "purchase"
    },
    {
      name: "Discount",
      value: "discount"
    },
    {
      name: "Intrest",
      value: "intrest"
    },
  ]
  useEffect(() => {
    if (open) {
      manageDefaultCustomer();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{type == "add" ? "Add" : "Edit"} Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className={cn("grid items-start gap-4")}
            onSubmit={handleSubmit}
          >
            <div className="grid gap-2">
              <Label htmlFor="text">Customer *</Label>
              <Select
                disabled={!Array.isArray(data)}
                value={defaultCustomer}
                onValueChange={(value) => setDefaultCustomer(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                  {
                    !Array.isArray(data) ? (
                        <SelectItem value={data?._id}>
                          {data?.firstName + " " + data?.lastName}
                        </SelectItem>
                      ) : (
                         data?.map((item: any) => (
                          <SelectItem value={item?.id}>
                            {item?.firstName + " " + item?.lastName}
                          </SelectItem>
                        ))
                      )
                    }
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Transaction date</FormLabel>
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
                          {field.value
                            ? format(field.value, "PPP")
                            : format(Date.now(), "PPP")}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        // initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="₹0.00"
                      {...field}
                      required
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d.]/g, '');
                        const parts = value.split('.');
                        if (parts.length > 2) {
                          return;
                        }
                        field.onChange(value);
                      }}
                      onBlur={(e) => {
                        const formatted = formatPrice(e.target.value);
                        field.onChange(formatted);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tax" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {typeOptions.map((item) => (
                          <SelectItem value={item?.value} key={item?.value}>
                            {item?.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className={"w-full"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Payment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                    </SelectContent>
                  </Select>
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
