export const formatPrice = (value: any) => {
    // Remove all non-numeric characters except decimal point
    if(value){
      const numericValue = value?.toString()?.replace(/[^0-9.]/g, "");
      // Format as currency
      if (numericValue) {
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 0,
        }).format(Number.parseFloat(numericValue));
        return formatted;
      }
      return value;
    }else{
      return 0
    }
  };

  export const deFormatPrice = (value: any) => {
    if(value){
      return value.slice(1).replace(/,/g, "");
    }else{
      return 0
    }
  };