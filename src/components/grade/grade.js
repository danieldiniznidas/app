import React, { Component } from 'react';

import "./style.css";

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  table: {
    minWidth: 650,
  },
});

class Grade extends Component {

    renderHeader() {
        return (
            <TableRow key={0}>
                {this.props.metaData.map((title, i) => {
                    return (
                        <TableCell key={i} align={title.align?title.align:"left"}>
                            {title.label}
                        </TableCell>
                    )})}
            </TableRow>
        );
    }

    renderContent() {
        return (
            <TableBody>
                {this.props.dataSource.map((record, i) => {
                    return (
                        <TableRow className="grade-foco" key={i}>
                            {this.props.metaData.map((title, j) => {
                                if (title.render) {
                                    return (
                                        <TableCell key={j} align={title.align?title.align:"left"}>
                                            {title.render(record)}
                                        </TableCell>
                                    )
                                } else {
                                    return (
                                        <TableCell key={j} align={title.align?title.align:"left"}>
                                            {record[title.field]}
                                        </TableCell>
                                    )
                                }                                
                            })}
                        </TableRow>
                    )})}
            </TableBody>
        );
    }
    
    render () {
        const { classes } = this.props;

        return (
            <TableContainer>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        {this.renderHeader()}
                    </TableHead>
                    {this.renderContent()}
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={this.props.rowCount}
                    rowsPerPage={this.props.rowPage}
                    page={this.props.currentPage}
                    onChangePage={this.props.onChangePage}
                    onChangeRowsPerPage={this.props.onChangeRowPage}
                    labelRowsPerPage="Linhas por página"
                />
            </TableContainer>
        )}
}

export default withStyles(styles)(Grade);