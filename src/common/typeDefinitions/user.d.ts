import { IUser } from "src/modules/user/interface/user.interface";

declare global{
    namespace Express{
        interface Request{
            user?: IUser
        }
    }
}