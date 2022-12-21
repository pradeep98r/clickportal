export function getText(partType){
    return (partType.charAt(0).toUpperCase() +
    partType.toLowerCase().slice(1)).replace('_',' ')
  }
  export default {getText};
