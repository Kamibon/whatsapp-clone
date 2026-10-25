import {User} from '../types/interfaces'

export class UserMapper {
    
    public static toResponse(user: User){
         const { password, ...userResponse } = user;
         return userResponse
    }
}