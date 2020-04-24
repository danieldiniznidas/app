import React, { Component } from "react";
import api from "../../services/api";

import { Grade } from "../../components";

import { Link } from "react-router-dom";

export default class Estados extends Component {
    state = {
        metaData: [
            {label: "UF", field: "id_estado", align: "center"},
            {label: "Nome", field: "nome"},
            {label: "Cidades", 
                render: (record) => {
                    return (
                        <Link to={`/cidades/${record.id_estado}`}>
                            Cidades
                        </Link>
                    )
                }
            }
        ],
        dataSource: [],
        rowPage: 10,
        currentPage: 0,
        rowCount: 0
    }

    componentDidMount() {
        this.loadEstados(this.state.currentPage, this.state.rowPage);
    }

    loadEstados = async (page, pageSize) => {
        const url = "/estados?page=" + (page + 1) + "&limit=" + pageSize;
        const response = await api.get(url);

        this.setState({ 
            dataSource: response.data.rows,
            currentPage: page,
            rowPage: pageSize, 
            rowCount: response.data.infoRows.count,
        });        
    }

    onChangePage = async (event, newPage) => {
        await this.loadEstados(newPage, this.state.rowPage);
    }
    
    onChangeRowPage = async (event) => {
        await this.loadEstados(0, event.target.value);
    }

    render() {        
        const { dataSource, metaData, rowCount, rowPage, currentPage } = this.state;

        return (       
            <Grade 
                dataSource={dataSource} 
                metaData={metaData}
                rowCount={rowCount}
                rowPage={rowPage}
                currentPage={currentPage}
                onChangePage={this.onChangePage}
                onChangeRowPage={this.onChangeRowPage}/>
        )
    }
}