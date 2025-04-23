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
import { formatPrice, deFormatPrice } from "@/lib/converter";
import { getSuppliers } from "@/store/slices/supplierSlice";
import { createStock, getStocks } from "@/store/slices/stockSlice";

interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface Item {
  quantity?: any;
  name?: string;
  size?: number;
  unit?: string;
  price: any;
  salt: string;
  expiry?: any;
  totalPrice?: string;
}

export function AddStock({ open, type, setOpen }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.supplier);
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isNew, setIsNew] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState("");

  const form = useForm({
    defaultValues: {
      date: "",
      totalAmount: "",
      taxAmount: "",
      additionalCharges: "",
    },
  });

  const itemForm = useForm({
    defaultValues: {
      quantity: 1,
      name: "",
      size: 1,
      unit: "kg",
      price: "",
      salt: "",
      expiry: new Date(),
      totalPrice: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const formattedItems = items.map((item) => {
        const payloadObject = {
          ...item,
          price: item?.price.slice(1).replace(/,/g, ""),
        };
        delete payloadObject["totalPrice"];
        return payloadObject;
      });

      const payload = {
        date: format(form.getValues().date || Date.now(), "yyyy-MM-dd"),
        supplier: selectedSupplier,
        taxAmount: deFormatPrice(form.getValues().taxAmount),
        additionalCharges: deFormatPrice(form.getValues().additionalCharges),
        products: formattedItems,
      };
      await dispatch(createStock(payload)).unwrap();
      setOpen(false);
      resetForm();
      await dispatch(getStocks({ supplier: id })).unwrap();
      toast("Created successfully");
    } catch (err) {
      toast.error(err?.toString());
    }
  };

  const resetForm = () => {
    form.reset();
    setItems([]);
    setIsNew(false);
    setSelectedSupplier("");
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

  const price = itemForm.watch("price");

  const additionalChargesWatcher = form.watch("additionalCharges");
  const taxAmountWatcher = form.watch("taxAmount");

  const getTotalPrice = () => {
    const numericPrice = parseFloat(price?.replace(/[^\d.-]/g, "") || "0");
    return formatPrice((numericPrice * quantity).toFixed(2));
  };

  const globalTotalAmount = () => {
    return items.reduce(
      (acc, curr) => acc + deFormatPrice(curr?.price) * curr?.quantity,
      0
    );
  };

  const golbalGrandTotal = () => {
    const totalOrderValue = globalTotalAmount();
    return (
      totalOrderValue +
      parseInt(deFormatPrice(additionalChargesWatcher)) +
      parseInt(deFormatPrice(taxAmountWatcher))
    );
  };

  useEffect(() => {
    dispatch(getSuppliers({ limit: 100000 })).unwrap();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[50%]">
        <DialogHeader>
          <DialogTitle>{type == "add" ? "Add" : "Edit"} Stock</DialogTitle>
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
              <Label htmlFor="text">Supplier *</Label>
              <Select
                disabled={!Array.isArray(data)}
                value={selectedSupplier}
                onValueChange={(value) => setSelectedSupplier(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {data?.map((item: any) => (
                      <SelectItem value={item?.id} key={item?.id}>
                        {item?.name}
                      </SelectItem>
                    ))}
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
            <FormField
              control={form.control}
              name="taxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Amount</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!Array.isArray(data)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a tax" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {new Array(29).fill(0).map((_, index) => (
                          <SelectItem value={String(index)} key={index}>
                            {index}%
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="taxAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Amount</FormLabel>
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
            <FormField
              control={form.control}
              name="additionalCharges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional charges</FormLabel>
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
            <div className="col-span-2 w-full">
              <div className="flex flex-col gap-4 w-full">
                {items.map((item: Item, index: number) => (
                  <Card className="p-4 shadow-sm rounded-lg w-full" key={index}>
                    <CardContent className="text-sm">
                      <div className="flex justify-between">
                        <p className="font-medium">
                          {item?.name} {item?.salt ? `(${item?.salt})` : ""}
                        </p>
                        <p className="text-gray-500">
                          {item?.quantity} × {item?.size}
                          {item?.unit}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Expiry</span>
                        <span className="font-medium">
                          {format(item?.expiry, "PPP")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Single Price:</span>
                        <span className="font-medium">
                          {formatPrice(item?.price)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Price:</span>
                        <span className="font-medium">
                          {formatPrice(
                            deFormatPrice(item?.price) * item?.quantity
                          )}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {!isNew && (
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setIsNew(true)}>Add Product</Button>
                </div>
              )}
            </div>
          </form>
        </Form>
        {isNew && (
          <Card className="p-5">
            <Form {...itemForm}>
              <form
                className="grid grid-cols-2 gap-6"
                onSubmit={itemForm.handleSubmit(handleSaveItems)}
              >
                <FormField
                  control={itemForm.control}
                  name="name"
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
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
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
                          <SelectItem value="ltr">ltr</SelectItem>
                          <SelectItem value="gm">gm</SelectItem>
                          <SelectItem value="ml">ml</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={itemForm.control}
                  name="salt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salt</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter salt name"
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
                  name="expiry"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Expiry date</FormLabel>
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
                <FormField
                  control={itemForm.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total price</FormLabel>
                      <FormControl>
                        <Input
                          readOnly={true}
                          placeholder="₹0.00"
                          {...field}
                          required
                          value={getTotalPrice()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  <Button type="submit">Add Product</Button>
                </div>
              </form>
            </Form>
          </Card>
        )}
        <div className="w-full p-3 border border-dashed rounded-xl space-y-2 text-sm font-medium">
          <div className="flex justify-between m-0">
            <span>Total Amount.</span>
            <span>+{globalTotalAmount()}</span>
          </div>
          {additionalChargesWatcher && (
            <div className="flex justify-between m-0">
              <span>Additional Charges.</span>
              <span>+{additionalChargesWatcher}</span>
            </div>
          )}
          {taxAmountWatcher && (
            <div className="flex justify-between m-0">
              <span>Tax Amount.</span>
              <span>
                +{(Number(taxAmountWatcher) * globalTotalAmount()) / 100}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold m-0">
            <span>Grand Total.</span>
            <span>{golbalGrandTotal()}</span>
          </div>
        </div>
        <div className="text-center">
          <Button type="button" className="w-[50%]" onClick={handleSubmit}>
            Save changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
