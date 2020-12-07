import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
// import Home from './components/Home';

function App() {
    return (
        <Router>
            <div className="App">
                <main>
                    <Switch>
                        <Route path='/signin' exact component={Login} />
                        {/* <Route path='/' exact component={Home} /> */}
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;