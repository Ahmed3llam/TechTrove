export interface ICart {
    $id: number,
    cartDto: {
        $id: Number,
        $values: ICartArray[],
    },
    totalPrice: number
}

export interface ICartArray {
    id: number,
    title: string,
    description: string,
    img: string,
    price: number,
    stock: number,
    quantity: number,
    tPrice: number
}