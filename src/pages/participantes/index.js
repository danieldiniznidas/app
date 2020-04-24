import React, { Component } from "react";
import formatUtils from "../../services/formatUtils";

import { Grade, PageControl, TabSheet, MsgError } from "../../components";

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { getAll, getId, removeRecord, newRecord, refreshRecord } from "./participantes-service";

const styles = theme => ({
    formPesquisa: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    buttonLeft: {
        margin: theme.spacing(3, 0, 0),
        float: "left"
    },
    buttonRight: {
        margin: theme.spacing(3, 0, 0),
        float: "right"
    },
});

class Participantes extends Component {
    state = {
        tabIndex: "1",

        metaData: [
            {label: "ID", field: "id_participante"},
            {label: "CPF/CNPJ", 
                render: (record) => {
                    return (<span>
                                {formatUtils.formatCPF_CNPJ(record.cnpj_cpf)}
                            </span>)}},
            {label: "Nome", field: "razao_nome"},
            {label: "Cidade", field: "cidade_nome"},
            {label: "UF", field: "cidade_uf"},
            {label: "Dh.Registro", 
                render: (record) => {
                    return (<span>
                                {formatUtils.formatDateTime(record.dh_alt)}
                            </span>)}},
            {label: "Opções", 
                render: (record) => {
                    return (<span>
                                <a onClick={() => this.onEditRecord(record)}>
                                    Editar
                                </a>
                            </span>)}},
        ],
        dataSource: [],        
        rowPage: 5,
        currentPage: 0,
        rowCount: 0,
        filtro: {},

        data: {},
    }

    componentDidMount() {
        this.loadParticipantes();
    }

    loadParticipantes = async (page = 0, pageSize = this.state.rowPage) => {
        const response = await getAll(page + 1, this.state.filtro, pageSize);

        this.setState({ 
            dataSource: response.rows,
            currentPage: page,
            rowPage: pageSize, 
            rowCount: response.infoRows.count
        });
    }

    saveParticipante = async(data) => {
        const response = {};
        
        if (data.id_participante === undefined){
            response = await newRecord(data);
        } else {
            response = await refreshRecord(data.id_participante, data);   
        }

        if (response.status){
            this.loadUsuarios();    
            this.setState({ 
                tabIndex: "1",
                data: {},
                senhaConfirmacao: ""
            });
        } else {
            this.setState({ 
                error: true,
                errorMsg: response.message,
            });
        }
    }

    onGravar() {
        //Validar

        //Gravar
        this.saveParticipante(this.state.data);
        return true;
    }
    
    onEditRecord(record){
        this.editParticipante(record.id_usuario);
    }

    onSearch = async () => {
        await this.loadParticipantes(0);
    }

    onChangePage = async (event, newPage) => {
        await this.loadParticipantes(newPage);
    }
    
    onChangeRowPage = async (event) => {
        await this.loadParticipantes(0, event.target.value);
    }

    onTabChange = async (activeKey) => {
        this.setState({ tabIndex: activeKey });
    }

    onClearRecord() {
        this.setState({ 
            data: {}, 
        });
    }

    onchangetab = (index) => {
        this.setState({ tabIndex: index });
    }

    onCloseError = async () => {
        this.setState({ 
            error: false, 
            errorMsg: "",
        });
    }

    render() {
        const { data, error, errorMsg, dataSource, metaData, rowCount, rowPage, currentPage, filtro, tabIndex } = this.state;
        const { classes } = this.props;

        return (  
            <>   
                <PageControl tabindex={tabIndex} onchangetab={this.onchangetab}>
                    <TabSheet label="Consulta">
                        <div>
                            <TextField
                                className={classes.formPesquisa}
                                id="pesquisa"
                                label="Pesquisa"
                                name="pesquisa"
                                autoFocus
                                style={{width: 500}}
                                value={filtro.nome}                            
                                onChange={e => this.setState({ filtro: { ...this.state.filtro, nome: e.target.value }})}
                            />
                            <Button 
                                variant="contained"
                                className={classes.buttonRight}
                                type="primary"
                                onClick={() => this.onSearch()}>Pesquisar
                            </Button>
                        </div>
                        <Grade 
                            dataSource={dataSource} 
                            metaData={metaData}
                            rowCount={rowCount}
                            rowPage={rowPage}
                            currentPage={currentPage}
                            onChangePage={this.onChangePage}
                            onChangeRowPage={this.onChangeRowPage}/>
                    </TabSheet>
                    <TabSheet label="Manutenção">         
                    </TabSheet>
                </PageControl>
                <MsgError error={error} errorMsg={errorMsg} onclose={this.onCloseError}/>
            </>
        )
    }
}

export default withStyles(styles)(Participantes);