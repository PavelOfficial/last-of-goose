
export const leadingZeros = (value: number, digitCount: number) => {
    return `00000000000${value}`.slice(-digitCount);
}