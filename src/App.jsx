/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import './App.css'
import UserTypeRouter from './utils/UserTypeRouter'
// eslint-disable-next-line no-unused-vars
import { userContext } from './utils/AppContexts'
import { SignInForm } from './components/Auth/SignInForm/SignInForm'
import SignOutBtn from './components/Auth/SignOutBtn/SignOutBtn'
function App() {
  
  const [user, setUser] = useState({
    type: '',
    fullName: '',
    nickName: '',
    session: false,
    email: '',
    avatarUrl: '',
    phone: '',
    address: '',
    loadingState: true
  })

  useEffect(() => {
    UserTypeRouter(user, setUser);
  console.log("userData is:",user);

  }, []);//this function cheks auth state changes
  return (
    <userContext.Provider value={[user, setUser]}>
      {user.loadingState && <h2>Loading...</h2>}
      {!user.loadingState && <h1 color='black'>Hello {user.fullName}</h1>}
      <SignInForm />
      <SignOutBtn />
    </userContext.Provider>
  )
}

export default App
