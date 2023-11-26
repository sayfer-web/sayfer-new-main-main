import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    name: string;

    @IsEmail()
    email: string

    @IsString()
    phoneNumber: string;

    @IsNumber()
    investSum: number;

    @IsString()
    coverLetter: string;
}
