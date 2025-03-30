import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/index";
import { createOrder, getGlobalOrders } from "@/store/slices/orderSlice";
import {
  getCustomerDetail
} from "@/store/slices/customerSlice";
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
import { CalendarIcon, Minus, Plus } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "../ui/card";
import { RootState } from "@/store/index";
import { useParams } from "react-router-dom";
import { formatPrice } from "@/lib/converter";
interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface Item {
  quantity: number;
  productName: string;
  unitAmount: number;
  unit: string;
  // actualPrice: string;
  price: string;
}

export function AddOrder({ open, type, setOpen }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.customer);
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isNew, setIsNew] = useState(false);
  const [defaultCustomer, setDefaultCustomer] = useState("");
  const form = useForm({
    defaultValues: {
      date: "",
    },
  });

  const itemForm = useForm({
    defaultValues: {
      quantity: 1,
      productName: "",
      unitAmount: 1,
      unit: "kg",
      // actualPrice: "",
      price: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const formattedItems = items.map((item) => {
        return {
          name: item?.productName,
          quantity: item?.quantity,
          unit: item?.unit,
          unitAmount: item?.unitAmount,
          // actualPrice: item?.actualPrice.slice(1),
          price: item?.price.slice(1).replace(/,/g, ""),
        };
      });

      const payload = {
        date: format(form.getValues().date || Date.now(), "yyyy-MM-dd"),
        customer: defaultCustomer,
        items: formattedItems,
      };
      await dispatch(createOrder(payload)).unwrap();
      setOpen(false);
      resetForm();
      await dispatch(getGlobalOrders({ customer: id })).unwrap();
      dispatch(getCustomerDetail(`${id}`)).unwrap();
      toast("Created successfully");
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  const resetForm = () => {
    form.reset();
    setItems([]);
    setIsNew(false);
    setDefaultCustomer("");
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    itemForm.setValue("quantity", newQuantity);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      itemForm.setValue("quantity", newQuantity);
    }
  };

  const handleSaveItems = async () => {
    const existingItems = [...items];
    existingItems.push(itemForm.getValues());
    setItems(existingItems);
    itemForm.reset();
    setQuantity(1);
    setIsNew(false);
  };

  const manageDefaultCustomer = () => {
    if (!Array.isArray(data)) {
      setDefaultCustomer(data?._id);
    }
  };

  useEffect(() => {
    if (open) {
      manageDefaultCustomer();
    }
  }, [open]);
 
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
          <form
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            // onSubmit={handleSubmit}
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Customer Selectio */}
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
                          <SelectItem value={item?.id} key={item?.id}>
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
                  <FormLabel>Bill date</FormLabel>
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
                {items.map((item: Item, index: number) => (
                  <Card className="p-4 shadow-sm rounded-lg w-full" key={index}>
                    <CardContent className="text-sm">
                      <div className="flex justify-between">
                        <p className="font-medium">{item?.productName}</p>
                        <p className="text-gray-500">
                          {item?.quantity} × {item?.unitAmount}
                          {item?.unit}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price:</span>
                        <span className="font-medium">{formatPrice(item?.price)}</span>
                      </div>
                      {/* <div className="flex justify-between">
                        <span className="text-gray-400">Actual Price:</span>
                        <span className="font-medium">{item?.actualPrice}</span>
                      </div> */}
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!isNew && (
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsNew(true)}>Add Item</Button>
                </div>
              )}
            </div>
          </form>
        </Form>
        {isNew && (
          <Form {...itemForm}>
            <form
              className="grid grid-cols-2 gap-6"
              onSubmit={itemForm.handleSubmit(handleSaveItems)}
            >
              <FormField
                control={itemForm.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter product name"
                        className="w-full"
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
                control={itemForm.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Quantity</FormLabel>
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min={1}
                          className="w-20 text-center"
                          value={quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              setQuantity(val);
                              field.onChange(val);
                            }
                          }}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={incrementQuantity}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="unitAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        required
                        placeholder="Enter unit amount"
                        {...field}
                        onChange={(e) => {
                          const val = Number.parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className={"w-full"}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="l">l</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={itemForm.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
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

              {/* Actual Price Field */}
              {/* <FormField
                control={itemForm.control}
                name="actualPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Actual Price</FormLabel>
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
              /> */}
              <div className="col-span-2 flex justify-end gap-2.5">
                <Button
                  variant="outline"
                  onClick={() => {
                    itemForm.reset();
                    setIsNew(false);
                    setQuantity(1);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </Form>
        )}
        <div className="text-center">
          <Button type="button" className="w-[50%]" onClick={handleSubmit}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
