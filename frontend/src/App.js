import {Route, Switch} from "react-router-dom";
import Layout from "./components/UI/Layout/Layout";
import Register from "./containers/Register/Register";
import Login from "./containers/Login/Login";
import Messages from "./containers/Messages/Messages";

const App = () => {

    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Messages}/>
                <Route path="/register" component={Register}/>
                <Route path="/login" component={Login}/>
                <Route render={() => <h1 style={{textAlign: 'center'}}>Not found!</h1>}/>
            </Switch>
        </Layout>
    );
}

export default App;
