import React, { Component } from "react";
import api from "../../services/api";

import { Link } from "react-router-dom";

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 200,
      backgroundColor: theme.palette.background.paper,
    },
    nested1: {
        paddingLeft: theme.spacing(4),
    },
    nested2: {
        paddingLeft: theme.spacing(6),
    },
    nested3: {
        paddingLeft: theme.spacing(8),
    },
});

class MenuApp extends Component {
    state = {
        menus: [],
        opened: {},
    }

    componentDidMount() {
        this.loadMenus();
    }

    onChangeOpen = (menu) => {
        this.setState({ opened: { ...this.state.opened, ["m" + menu.id_menu]: !this.state.opened["m" + menu.id_menu] }});
    }

    loadMenus = async () => {
        const response = await api.get("/menus");

        this.setState({ 
            menus: response.data.rows 
        });        

        for (var menu in this.state.menus){
            this.setState({ opened: { ...this.state.opened, ["m" + menu.id_menu]: false }})
        }
    }

    renderSubMenu (menu, nivel){
        let className = undefined;
        const { classes } = this.props;

        switch (nivel) {
            case 1: 
                className = classes.nested1;
                break;
            case 2: 
                className = classes.nested2;
                break;
            case 3: 
                className = classes.nested3;
                break;
        }

        return (
            <>
                <ListItem 
                    button 
                    onClick={() => this.onChangeOpen(menu)} 
                    className={className}>
                    <ListItemText>
                        {menu.nome}
                    </ListItemText>
                    {this.state.opened["m" + menu.id_menu] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse in={this.state.opened["m" + menu.id_menu]} timeout="auto" unmountOnExit>
                    <List component="div">
                        {this.state.menus.map((submenu) => {
                            if (submenu.id_menu_pai === menu.id_menu) { 
                                if (submenu.acesso_site !== null)
                                    return this.renderMenuItem(submenu, nivel + 1)
                                else 
                                    return this.renderSubMenu(submenu, nivel + 1)
                            }
                        })}
                    </List>
                </Collapse>
            </>
        )
    }

    renderMenuItem (menu, nivel) {
        let className = undefined;
        const { classes } = this.props;

        switch (nivel) {
            case 1: 
                className = classes.nested1;
                break;
            case 2: 
                className = classes.nested2;
                break;
            case 3: 
                className = classes.nested3;
                break;
        }

        return (
            <ListItem button className={className}>
                <ListItemText>
                    <Link to={menu.acesso_site}>{menu.nome}</Link>
                </ListItemText>
            </ListItem>
        )
    }

    render () {
        const { classes } = this.props;

        const listMenu = this.state.menus.map((menu) =>             
            {
                if (menu.id_menu_pai === null) { 
                    if (menu.acesso_site !== null)
                        return this.renderMenuItem(menu, 0)
                    else 
                        return this.renderSubMenu(menu, 0)
                }
            }
        );

        return (
            <List component="nav"
                className={classes.root}
                aria-labelledby="nested-list-subheader">
                <ListItem button>
                    <ListItemText>
                        <Link to={"/"}>Home</Link>
                    </ListItemText>                    
                </ListItem>
                {listMenu}
            </List>
        )
    }
}

export default withStyles(styles)(MenuApp);