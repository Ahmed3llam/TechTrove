export interface IWish {
    $id: number,
    $values: IWishArray[]
}

export interface IWishArray {
    id: number,
    title: string,
    description: string,
    img: string,
    price: number,
    stock: number,
    quantity: number,
    tPrice: number
}