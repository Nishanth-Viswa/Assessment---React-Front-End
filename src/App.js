import './App.css';
import { Switch, Route } from 'react-router-dom';
import Login from './components/public/login';
import Dashboard from './components/protected';
import { ProtectedRoute } from './utils/protectedRoute';
function App() {
  return (
    <Switch>
      <Route exact path='/' component={Login} />
      <ProtectedRoute path='*' component={Dashboard}/>
    </Switch>
  );
}

export default App;
