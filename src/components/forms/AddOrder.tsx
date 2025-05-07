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
import { getCustomerDetail } from "@/store/slices/customerSlice";
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
import { deFormatPrice, formatPrice } from "@/lib/converter";
import { getProductsDropdown } from "@/store/slices/productSlice";
interface FormProps {
  open: boolean;
  type: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

interface Item {
  quantity: number;
  product: string;
  size: number;
  unit: string;
  price: string;
}

export function AddOrder({ open, type, setOpen }: FormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.customer);
  const { dropdown } = useSelector((state: RootState) => state.product);
  const { id } = useParams();
  const [items, setItems] = useState<Item[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isNew, setIsNew] = useState(false);

  const [defaultCustomer, setDefaultCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>({});

  const form = useForm({
    defaultValues: {
      date: new Date(),
    },
  });

  const itemForm = useForm({
    defaultValues: {
      quantity: 1,
      product: "",
      size: 1,
      unit: "kg",
      price: "",
      totalPrice: "",
      orgPrice: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const formattedItems = items.map((item) => {
        return {
          product: item?.product,
          quantity: item?.quantity,
          unit: item?.unit,
          size: item?.size,
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
    existingItems.push({
      ...itemForm.getValues(),
      product: selectedProduct?.id,
    });
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
  const price = itemForm.watch("price");
  
  const getTotalPrice = () => {
    const numericPrice = parseFloat(price?.replace(/[^\d.-]/g, "") || "0");
    return formatPrice((numericPrice * quantity).toFixed(2));
  };
  const golbalGrandTotal = () => {
    return items.reduce((acc, curr) => acc + (deFormatPrice(curr?.price) * curr?.quantity), 0);
  }

  useEffect(() => {
    if (open) {
      manageDefaultCustomer();
      dispatch(getProductsDropdown({})).unwrap();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogOverlay> */}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
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
                    {!Array.isArray(data) ? (
                      <SelectItem value={data?._id}>
                        {data?.firstName + " " + data?.lastName}
                      </SelectItem>
                    ) : (
                      data?.map((item: any) => (
                        <SelectItem value={item?.id} key={item?.id}>
                          {item?.firstName + " " + item?.lastName}
                        </SelectItem>
                      ))
                    )}
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
                        selected={field.value}
                        onSelect={field.onChange}
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
                {items.map((item: Item, index: number) => {
                  const product = dropdown.find(
                    (val: any) => val.id === item?.product
                  );

                  return (
                    <Card
                      className="p-4 shadow-sm rounded-lg w-full"
                      key={index}
                    >
                      <CardContent className="text-sm">
                        <div className="flex justify-between">
                          <p className="font-medium">
                            {product?.name || "N/A"}
                          </p>
                          <p className="text-gray-500">
                            {item?.quantity} × {product?.size || "N/A"}{" "}
                            {product?.unit || "N/A"}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Per peice Price:</span>
                          <span className="font-medium">
                            {formatPrice(item?.price)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Price:</span>
                          <span className="font-medium">
                            {formatPrice(deFormatPrice(item?.price)* item?.quantity)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
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
          <Card className="py-5 px-2">
            <Form {...itemForm}>
              <form
                className="grid grid-cols-2 gap-6"
                onSubmit={itemForm.handleSubmit(handleSaveItems)}
              >
                {/* <FormField
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
                /> */}
                <div className="grid gap-2">
                  <Label htmlFor="text">Product *</Label>
                  <Select
                    value={selectedProduct?.id}
                    onValueChange={(value) => {
                      const selected = dropdown.find(
                        (item: any) => item.id === value
                      );
                      setSelectedProduct(selected);
                      if (selected) {
                        itemForm.setValue("size", selected.size);
                        itemForm.setValue("unit", selected.unit);
                        itemForm.setValue("orgPrice", selected.price);
                      }
                    }}
                    // disabled={!Array.isArray(data)}
                    // value={selectedProduct?.id}
                    // onValueChange={(value) => setDefaultCustomer(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a Product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {dropdown?.map((item: any) => (
                          <SelectItem value={item?.id} key={item?.id}>
                            {item?.name} {`(${format(item?.stock?.date, "dd-MM-yyyy")})`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
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
                            className="text-center no-spinner p-0"
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
                          disabled={true}
                          type="number"
                          min={0}
                          step="0.01"
                          required
                          placeholder="Enter size"
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
                        value={field.value}
                        disabled={true}
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
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
                  control={itemForm.control}
                  name="totalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Price</FormLabel>
                      <FormControl>
                        <Input
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
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </Form>
          </Card>

        )}
         <div className="w-full p-3 border border-dashed rounded-xl space-y-2 text-sm font-medium">
          <div className="flex justify-between font-semibold m-0">
            <span>Grand Total.</span>
            <span>{formatPrice(golbalGrandTotal())}</span>
          </div>
        </div>
        <div className="text-center">
          <Button type="button" className="w-[50%]" onClick={handleSubmit}>
            Save changes
          </Button>
        </div>
      </DialogContent>
      {/* </DialogOverlay> */}
      
    </Dialog>
  );
}
