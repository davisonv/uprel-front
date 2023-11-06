import BaseAPI  from "./BaseAPI"

export class LoginAPI {

    async logar(userName, password) {
        const response = await BaseAPI.get('api/v1/usuarios/token/', {
            params: {
                'username': userName,
                'password': password,
            }
        })
        
        return response
    }
}