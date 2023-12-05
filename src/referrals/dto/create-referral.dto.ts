import { User } from "src/users/entities/user.entity";

export class CreateReferralDto {
    referredBy: User
    referredTo: User
}
