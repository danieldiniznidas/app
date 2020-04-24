import React, { Component } from "react";
import formatUtils from "../../services/formatUtils";

import { usuarioValidate, getAll, removeRecord, refreshRecord, newRecord } from "./usuarios-service";

import { Grade, PageControl, TabSheet, MsgError } from "../../components";

import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
        margin: theme.spacing(3, 2, 0),
        float: "right"
    },
});

class Usuarios extends Component {
    state = {
        tabIndex: 0,

        metaData: [
            {label: "ID", field: "id_usuario"},
            {label: "Nome", field: "nome"},
            {label: "Login", field: "login"},
            {label: "Situação", 
                render: (record) => {
                    return (<span>
                                {(record.dh_desativacao?"Desativado":"Ativo")}
                            </span>)}},
            {label: "Dh.Registro", 
                render: (record) => {
                    return (<span>
                                {formatUtils.formatDateTime(record.dh_alt)}
                            </span>)}},                
            {label: "Dh.Desativação", 
                render: (record) => {
                    return (<span>
                                {formatUtils.formatDateTime(record.dh_desativacao)}
                            </span>)}},
            {label: "Opções", 
                render: (record) => {
                    return (<span>
                                <a onClick={() => this.onEditStatus(record)}>
                                    {(record.dh_desativacao?"Ativar":"Inativar")}
                                </a>
                            </span>)}},
        ],
        dataSource: [],        
        rowPage: 5,
        currentPage: 0,
        rowCount: 0,
        filtro: {},

        data: {},
        error: false,
        errorMsg: "",
    }

    componentDidMount() {
        this.loadUsuarios();
    }

    loadUsuarios = async (page = 0, pageSize = this.state.rowPage) => {
        const response = await getAll(page + 1, this.state.filtro, pageSize);

        this.setState({ 
            dataSource: response.rows,
            currentPage: page,
            rowPage: pageSize, 
            rowCount: response.infoRows.count
        });        
    }

    changeStatusUsuario = async(id, status) => {
        let response = {};

        // Valida
        if (!status) {
            response = await removeRecord(id);
        } else {
            response = await refreshRecord(id, { dh_desativacao: null });
        }

        // Reprocessa
        if (response.status){
            this.loadUsuarios();
            this.setState({ 
                tabIndex: 0 
            });
        } else {
            this.setState({ 
                error: true,
                errorMsg: response.message,
            });
        }  
    }

    saveUsuario = async(data) => {
        const validate = await usuarioValidate(this.state.data);
        if (!validate.status) {
            this.setState({ 
                error: true,
                errorMsg: validate.message,
            });
            return;
        }

        const response = await newRecord(data);
        if (!response.status) {
            this.setState({ 
                error: true,
                errorMsg: response.message,
            });
            return;
        }   

        this.loadUsuarios();    
        this.setState({ 
            tabIndex: 0
        });

        this.onClearRecord(); 
    }

    onEditStatus(record){
        this.changeStatusUsuario(record.id_usuario, record.dh_desativacao !== null);
    }

    onGravar() {
        this.saveUsuario(this.state.data);
    }

    onSearch = async () => {
        await this.loadUsuarios(0);
    }

    onChangePage = async (event, newPage) => {
        await this.loadUsuarios(newPage);
    }
    
    onChangeRowPage = async (event) => {
        await this.loadUsuarios(0, event.target.value);
    }

    onClearRecord() {
        this.setState({ 
            data: {
                nome: "",
                login: "",
                senha: "",
                senhaConfirmacao:"",
            }
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
                                value={filtro.login}                            
                                onChange={e => this.setState({ filtro: { ...this.state.filtro, login: e.target.value }})}
                            />
                            <FormControl className={classes.formPesquisa}>
                                <InputLabel id="demo-simple-select-label">Situação</InputLabel>
                                    <Select
                                        defaultValue={0}
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={filtro.status}
                                        onChange={e => this.setState({ filtro: { ...this.state.filtro, status: e.target.value }})}>
                                        <MenuItem value={0}>Todos</MenuItem>
                                        <MenuItem value={1}>Ativos</MenuItem>
                                        <MenuItem value={2}>Inativos</MenuItem>
                                    </Select>
                            </FormControl>
                            <Button 
                                className={classes.buttonRight}
                                variant="contained"
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
                        <Grid container spacing={1}>
                            <Grid item xs={12}>    
                                <TextField
                                    required
                                    label="Nome"
                                    name="nome"
                                    style={{width: 500}}
                                    value={data.nome}                            
                                    onChange={e => this.setState({ data: { ...this.state.data, nome: e.target.value }})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Usuário"
                                    name="login"
                                    style={{width: 500}}
                                    value={data.login}                            
                                    onChange={e => this.setState({ data: { ...this.state.data, login: e.target.value }})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Senha"
                                    name="senha"
                                    type="password"
                                    style={{width: 500}}
                                    value={data.senha}                            
                                    onChange={e => this.setState({ data: { ...this.state.data, senha: e.target.value }})}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    label="Confirmação da Senha"
                                    type="password"
                                    name="senhaConfirmacao"
                                    style={{width: 500}}
                                    value={data.senhaConfirmacao}                            
                                    onChange={e => this.setState({ data: { ...this.state.data, senhaConfirmacao: e.target.value }})}
                                />
                            </Grid>                        
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                className={classes.buttonLeft}
                                variant="contained"
                                color="secondary"
                                onClick={() => this.onClearRecord()}>Limpar
                            </Button>
                            <Button 
                                className={classes.buttonRight}
                                variant="contained"
                                color="primary"
                                onClick={() => this.onGravar()}>Gravar
                            </Button>
                        </Grid>                    
                    </TabSheet>                
                </PageControl> 
                <MsgError error={error} errorMsg={errorMsg} onclose={this.onCloseError}/>
            </>           
        )
    }
}

export default withStyles(styles)(Usuarios);