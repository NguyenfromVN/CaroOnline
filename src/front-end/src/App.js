import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import DemoRealtime from './components/demoRealtime';
// import Home from './components/Home';

function App() {
    return (
        <Router>
            <div className="App">
                <main>
                    <Switch>
                        <Route path='/signin' exact component={Login} />
                        {/* <Route path='/' exact component={Home} /> */}
                        {/* '/' will be directed to demo realtime component */}
                        <Route path='/' exact component={DemoRealtime} />
                    </Switch>
                </main>
            </div>
        </Router>
    );
}

export default App;