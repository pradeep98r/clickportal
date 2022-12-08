export function getCurrencyNumberWithSymbol(number){
    return (
        number.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        })
    )
  }
  export function getCurrencyNumberWithOutSymbol(number){
    return (
        number.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        }).replace('₹', '') 
    )
  }
  export function getCurrencyNumberWithOneDigit(number){
    return (
        number.toFixed(1)
    )
  }
  export default {getCurrencyNumberWithSymbol,getCurrencyNumberWithOutSymbol,getCurrencyNumberWithOneDigit};
