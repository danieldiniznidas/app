import React, { Component } from "react";
import api from "../../services/api";

import { Grade } from "../../components";

export default class Cidade extends Component {
    state = {
        metaData: [
            {label: "IBGE", field: "id_cidade"},
            {label: "Nome", field: "nome"},
            {label: "UF", field: "uf", align: "center" }
        ],
        dataSource: [],
        rowPage: 10,
        currentPage: 0,
        rowCount: 0,
        filtro: "",
    }
 
    componentDidMount() {
        this.loadCidades(this.state.currentPage, this.state.rowPage);
    }

    loadCidades = async (page, pageSize) => {
        const { uf } = this.props.match.params;
        let url = "/cidades?page=" + (page + 1) + "&limit=" + pageSize;

        if (uf) {
            url = url + "&uf=" + uf;
        }

        if (this.state.filtro !== ""){
            url = url + "&nome=" + this.state.filtro;
        }   

        const response = await api.get(url);
        this.setState({ 
            dataSource: response.data.rows,
            currentPage: page,
            rowPage: pageSize, 
            rowCount: response.data.infoRows.count,
        }); 
    }

    onChangePage = async (event, newPage) => {
        await this.loadCidades(newPage, this.state.rowPage);
    }
    
    onChangeRowPage = async (event) => {
        await this.loadCidades(0, event.target.value);
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