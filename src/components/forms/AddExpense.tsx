import { FormEvent } from "react";
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
import { createExpense, getExpenses } from "@/store/slices/expenseSlice";

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatPrice } from "@/lib/converter";
interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export function AddExpense({ open, setOpen }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm({
    defaultValues: {
      date: new Date(),
      partner: "",
      amount: "",
      note: "",
    },
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const formValues = form.getValues();
      const payload = {
       ...formValues,
       amount: parseInt(formValues?.amount.slice(1))
      };

        await dispatch(createExpense(payload)).unwrap();
        setOpen(false);
        form.reset();
        await dispatch(
            getExpenses({ limit: 100000, sortBy: "createdAt:desc" })
        ).unwrap();
      toast("Created successfully");
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{true ? "Add" : "Edit"} Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className={cn("grid items-start gap-4")}
            onSubmit={handleSubmit}
          >
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
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
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="partner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Partner</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className={"w-full"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Partner" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Harmeet">Harmeet</SelectItem>
                      <SelectItem value="Sandeep">Sandeep</SelectItem>
                    </SelectContent>
                  </Select>
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
                      onChange={(e) => field.onChange(e.target.value)}
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
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Additional note"
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
