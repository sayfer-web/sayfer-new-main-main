import { IsString } from "class-validator"

export class CreateNewsDto {
    @IsString()
    content: string
    @IsString()
    title: string
}
