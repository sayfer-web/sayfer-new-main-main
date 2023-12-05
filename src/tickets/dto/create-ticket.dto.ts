import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string

    @IsString()
    phoneNumber: string;

    @IsString()
    investSum: string;

    @IsString()
    coverLetter: string;
}
