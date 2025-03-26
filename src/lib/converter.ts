
export const formatPrice = (value: string) => {
    // Remove all non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    // Format as currency
    if (numericValue) {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(Number.parseFloat(numericValue));
      return formatted;
    }
    return value;
  };
