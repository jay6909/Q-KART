import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Thanks from "./components/Thanks"
import Products from "./components/Products";
import Checkout from "./components/Checkout";
export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch >
        <Route exact path="/"  component={Products} />
        
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/checkout" component={Checkout}/>
        <Route exact path="/thanks" component={Thanks}/>

      </Switch>

      
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
          {/* <Login/> */}
    </div>
  );
}

export default App;
