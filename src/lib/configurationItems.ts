export const changeBooleanInArray = (currentArray: boolean[], position: number) => {
    const newArray = [...currentArray];
    newArray.splice(position, 1, !currentArray[position]);
    return newArray;
};
