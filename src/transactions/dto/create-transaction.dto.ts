import { IsNotEmpty } from "class-validator";

export class CreateTransactionDto {

    txid: string
    address: string
    receiver: string
    confirmations: number
    category: string
    tokenType: string
    amount: number
}
