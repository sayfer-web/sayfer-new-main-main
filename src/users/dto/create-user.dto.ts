import { IsOptional, IsString } from "class-validator"

export class CreateUserDto {
    @IsString()
    username: string
    @IsString()
    password: string
    @IsString()
    phoneNumber: string
    @IsOptional()
    @IsString()
    referrer: string
}
