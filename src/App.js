import './App.css';
import { Switch, Route } from 'react-router-dom';
import Login from './components/public/login';
import SignUp from './components/public/singup';
import Dashboard from './components/protected';
import { ProtectedRoute } from './utils/protectedRoute';
function App() {
  return (
    <Switch>
      <Route exact path='/' component={Login} />
      <Route exact path='/sign-up' component={SignUp} />
      <ProtectedRoute path='*' component={Dashboard}/>
    </Switch>
  );
}

export default App;
