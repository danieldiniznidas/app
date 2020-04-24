import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
});

class PageControl extends Component {
    state = {
        tabindex : 0,
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tabindex !== this.props.tabindex) {
            this.setState({
                tabindex: this.props.tabindex,
            })
        }
      }

    handleChange = (event, newValue) => {
        this.setState({
            tabindex: newValue,
        });

        this.props.onchangetab(newValue);

        console.log(newValue);        
    }

    a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        };
    }
    
    render () {
        const { classes, children } = this.props;
        const { tabindex } = this.state;

        const TabChildren = React.Children.map(children, (tab, i) => {
            return React.cloneElement(tab, { index: i, tabindex: tabindex })}
        );            

        return (
            <AppBar position="static" color="default">
                <Tabs
                    className={classes.root}
                    value={tabindex}
                    onChange={this.handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="full width tabs example">
                    {React.Children.map(children, (tab, i) => {
                        return <Tab label={tab.props.label} {...this.a11yProps(i)}/>
                        })
                    }
                </Tabs>
                {TabChildren}
            </AppBar>
        )
    }
}

export default withStyles(styles)(PageControl);