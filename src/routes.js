import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import auth from "./services/auth";

import Login, { Logout } from "./pages/login";

import Estados from "./pages/estados";
import Cidades from "./pages/cidades";
import Usuarios from "./pages/usuarios";
import Participantes from "./pages/participantes";
import { Main } from "./components";
import Dashboard from "./pages/dashboard";

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth.IsAuthenticed()
        ? <Component {...props} />
        : <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }} />
    )} />
);

const Routes = () => (    
    <BrowserRouter>
        <Switch>
            <Route exact path="/login" component={Login} />
            <Main>
                <PrivateRoute exact path="/" component={Dashboard} />

                <PrivateRoute exact path="/logout" component={Logout} />
                
                <PrivateRoute exact path="/estados" component={Estados} />
                <PrivateRoute exact path="/cidades/:uf" component={Cidades} />
                <PrivateRoute exact path="/cidades" component={Cidades} />

                <PrivateRoute exact path="/cadastros/sistemas/usuarios" component={Usuarios} />

                <PrivateRoute exact path="/cadastros/participantes" component={Participantes} />
                <PrivateRoute exact path="/cadastros/participantes/:id" component={Participantes} />  
            </Main>
        </Switch>
    </BrowserRouter>
);

export default Routes;