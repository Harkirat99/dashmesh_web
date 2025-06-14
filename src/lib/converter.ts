export const formatPrice = (value: any) => {
  if (value === null || value === undefined || value === "") return 0;

  // Convert to string and preserve negative sign
  const strValue = value.toString();
  const isNegative = strValue.trim().startsWith("-");
  
  // Remove all characters except digits and decimal point
  const numericValue = strValue.replace(/[^0-9.]/g, "");

  if (numericValue) {
    const number = Number.parseFloat(numericValue);
    const finalValue = isNegative ? -number : number;

    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(finalValue);

    return formatted;
  }

  return value;
};


  export const deFormatPrice = (value: any) => {
    if(value){
      return value?.slice(1)?.replace(/,/g, "");
    }else{
      return 0
    }
  };