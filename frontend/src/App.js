
import './App.css';
import Login from './components/Login';
// import Home from './components/Home';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
function App() {   
  return (
    <>
       <Navbar></Navbar>
       <div className='container my-4'>
        {/* <Home></Home>
         */}
         <Login></Login>
       </div>
    </>
  );
}
export default App;
