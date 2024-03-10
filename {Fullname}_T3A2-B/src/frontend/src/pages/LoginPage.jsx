import { useContext, useEffect, useState } from "react"
import Cookies from 'js-cookie'
import { NavLink, useNavigate} from 'react-router-dom'
import { ApiContext } from "../contexts/ApiProvider"
import ForgotPassword from "../components/ForgotPassword"

export default function LoginPage() {
    
    const navigate = useNavigate()
    
    const jwt = Cookies.get('jwt')
    //context
    const { apiUrl } = useContext(ApiContext)
    //useState
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [previousSessionCheck, setPreviousSessionCheck] = useState(false)
    //handles
    const handleSubmit  = async (event) => {
        event.preventDefault()

        if (!email) {
            window.alert('no email present. please enter a valid email address')
            return
        } else if (!password) {
            window.alert('no password present. please enter a valid password')
            return
        }
    
        try {
            const response = await fetch(`${apiUrl}/users/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            if (response.ok) {
                const data = await response.json()
                const jwt = data.jwt
                const auth = data.auth

                Cookies.set('jwt', jwt, { secure: true, sameSite: 'Strict', expires: 3 })
                Cookies.set('auth', auth, { secure: true, sameSite: 'Strict', expires: 3 })
                console.log('successfully logged in')
                navigate('/home')

            } else {
                console.error('Authentication failed')
                window.alert('invalid email or password, pleas try again')
            } 

        } catch (error) {
            console.error(error)
        }
     }

    const autoLogin = async () => {
        try {
            const response = await fetch(`${apiUrl}/users/auth-checker`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'jwt': jwt
                }
            });
    
            if (response && response.ok) { // Add a check for response existence
                console.log('Token still valid');
                navigate('/home');
            } else {
                setPreviousSessionCheck(true);
            }
        } catch (error) {
            console.error('Error during autoLogin:', error);
            setPreviousSessionCheck(true); // Set previousSession to true in case of error
        }
    }
    
    //useEffects
     useEffect(()=> {
        if (!previousSessionCheck) {
            autoLogin()
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])

     if (!previousSessionCheck) {
        return <p>checking for previous session...</p>;
    }


    return (
        <div className="loginPageContainer d-flex justify-content-center align-items-center flex-column overflow-auto" data-testid="login-form">
        <div className="loginBox row border rounded p-4 mx-sm-5" >
            <div className="col-md-6">
                <div className="loginContainer p-4">
                    <h2 className="text-center">Stream-Lined</h2>
                    <h1 className="text-center">Login To Your Account</h1>
                    <form 
                        autoComplete="on" 
                        className="loginPage d-flex flex-column" 
                        onSubmit={handleSubmit}
                        >
                        <div className="mb-4 mt-4">
                            <input 
                                type="text" 
                                name="emailInput" 
                                id="emailInput" 
                                value={email} 
                                className="form-control " 
                                placeholder="Enter your email"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <input 
                                type="password" 
                                name="passwordInput" 
                                id="passwordInput" 
                                value={String(password)} 
                                className="form-control" 
                                placeholder="Enter your password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                        >
                            Login
                        </button>
                    </form>
                    <div className="text-center mt-3">
                        <ForgotPassword/>
                    </div>
                    <div className="text-center mt-4">
                        <p>Don't have an account? <NavLink to="/create-new-user">Sign up</NavLink></p>
                    </div>  
                </div>
            </div>
            <div className="col-md-6">
                <div className="text-center mb-5 border-bottom">
                    <h1 className="mb-4 d-none d-md-block">New Here?</h1>
                    <p>Unlock potential. Sign up, submit forms, and make things happen!</p>
                </div>
                <ul className="mx-5 d-none d-md-block">
                    <li className="mb-5">
                        <p>Create new types of forms to incorporate into your workflow</p>
                    </li>
                    <li className="mb-5">
                        <p>Assign and re-assign tasks to manage workflow</p>
                    </li>
                    <li className="mb-5">
                        <p>Pin your favourite form types to your home page</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    )
}