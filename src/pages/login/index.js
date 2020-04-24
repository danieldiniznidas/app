import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import auth from "../../services/auth";
import { login, loginValidate } from "./login-service";

import { MsgError } from '../../components';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
});

export class Logout extends Component {
    componentDidMount() {
        auth.RemoveToken();
    }

    render() { 
        return (
            <Redirect to="/login"/>
        )
    }    
}

class Login extends Component {
    state = {
        usuario: auth.GetUser(),
        senha: "",
        ManterLogado: (auth.GetUser() !== null),
        logado: auth.IsAuthenticed(),
        error: false,
        errorMsg: "",
    }

    onLogin = async(e) => {
        e.preventDefault();

        //Validação
        const validate = await loginValidate(this.state);
        if (!validate.status) {
            this.setState({ 
                error: true,
                errorMsg: validate.message,
            });
            return;
        }

        //Login
        const response = await login(this.state.usuario, this.state.senha);
        if (!response.status) {
            this.setState({ 
                error: true,
                errorMsg: response.message,
            });
            return;
        }
        
        auth.SetToken(response.token);
        this.setState({ logado: true });    

        if (this.state.ManterLogado) {                    
            auth.SetUser(this.state.usuario);
        } else {
            auth.RemoveUser();
        }   
    };

    onCloseError = async () => {
        this.setState({ 
            error: false, 
            errorMsg: "",
        });
    }

    render () {
        const { classes } = this.props;
        
        if (this.state.logado === true) {
            return <Redirect to="/"/>
        }        

        const { error, errorMsg } = this.state;

        return (
            <Container component="main" maxWidth="xs">                
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <form className={classes.form}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Usuário"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={this.state.usuario} 
                            onChange={e => this.setState({ usuario: e.target.value })}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Senha"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={this.state.senha} 
                            onChange={e => this.setState({ senha: e.target.value })}
                        />
                        <FormControlLabel
                            control={<Checkbox 
                                        value="remember" 
                                        color="primary"
                                        checked={this.state.ManterLogado}
                                        onChange={e => this.setState({ ManterLogado: e.target.checked })}/>}
                            label="Lembrar usuário"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.onLogin}>
                            Login
                        </Button>
                    </form>
                </div>
                <MsgError error={error} errorMsg={errorMsg} onclose={this.onCloseError}/>
            </Container>
    )}
}

export default withStyles(styles)(Login);