import React, { Component } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import MenuApp from "./menu";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Drawer from '@material-ui/core/Drawer';

import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 200;
const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
  });

class Main extends Component {
    state = {
        empresa: "NIDAS APP",
    }

    loadEmpresa = async () => {
        const response = await api.get("/empresa");   
        this.setState({ empresa: response.data.nome });
    }

    componentDidMount() {
        this.loadEmpresa();    
    }

    render () {
        const { classes } = this.props;
        const { empresa } = this.state;

        return (
            <div id="main" className={classes.root}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            {empresa}
                        </Typography>
                        <Link to="/logout">
                            <Button color="inherit">
                                Logout
                            </Button>
                        </Link>                        
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <MenuApp />
                </Drawer>
                <main className={classes.content}>
                    <Toolbar />
                    {this.props.children}    
                </main>           
            </div>
        )
    }
}

export default withStyles(styles)(Main);