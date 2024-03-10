import { useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { ApiContext } from "../contexts/ApiProvider";
import Cookies from "js-cookie";

export default function AuthChecker() {
    const navigate = useNavigate()
    const { apiUrl } = useContext(ApiContext) 

    useEffect(() => {
        async function checkAuthentication() {

        const jwt = Cookies.get('jwt')

        if (!jwt) {
            navigate('/')
            console.log('no token present, returning to login...')
            return
        }

        try{
            const response = await fetch(`${apiUrl}/users/auth-checker`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt': jwt
                }
            })
    
            if(!response.ok) {
                if (response.status === 401) {
                    console.error('Unauthorized access. Re-directing to login page')
    
                    navigate('/')
                
                } else if (response.status === 403) {
                    console.error('Invalid token, Re-directing to login page')
                
                    navigate('/')
                } else {
                    console.error('error:', response.statusText)
                }
            }
        } catch (error) {
            console.error('error:', error.message)
        }
    }        
        checkAuthentication()
    },[apiUrl,navigate])

    return null
}
        
