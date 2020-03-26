export const toggleArrayItem = (array, value) => {
    const i = array.indexOf(value);
    if (i === -1)
        array.push(value);
    else
        array.splice(i,1);
}
  

