import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        padding: theme.spacing(2),
    },
});

export class TabSheet extends Component {
    render () {
        const { classes, index, tabindex } = this.props;

        return (
            <div hidden={index !== tabindex} className={classes.root}>
                {this.props.children}
            </div>
        )
    }
}

export default withStyles(styles)(TabSheet);