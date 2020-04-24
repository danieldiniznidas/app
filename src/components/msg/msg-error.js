import React, { Component } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default class MsgError extends Component {
    onErrorClose = async (event, reason) => {
        this.props.onclose();
        if (reason === "clickaway") {
          return;
        }
    }    

    render () {
        const { errorMsg } = this.props;
        let msg = errorMsg;

        if (Array.isArray(errorMsg)) {
            msg = errorMsg.map((error, i) => {
                    return (
                        <>
                            {error} 
                            <br />
                        </>
                    )
            });
        }     

        return (
            <Snackbar open={this.props.error} autoHideDuration={6000} onClose={this.onErrorClose}>
                <MuiAlert elevation={6} variant="filled" onClose={this.onErrorClose} severity="error">
                    {msg}
                </MuiAlert>
            </Snackbar>
    )}
}