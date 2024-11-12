export type ProductStocEntry = {
    productId: string,
    productName: string,
    quantity: number,
    currentUnit: string,
    units: Unit[],
    skuId: string,
}

export type Unit = {
    unitId: string,
    unitName: string,
}