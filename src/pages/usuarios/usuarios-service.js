import api from "../../services/api";
import * as yup from 'yup';

const usuarioSchema = yup.object().shape({
    nome: yup
        .string()
        .required("Nome é obrigatório"),
    login: yup
        .string()
        .required("Usuário é obrigatório")
        .email("Usuário deve ser um e-mail"),
    senha: yup
        .string()
        .required("Senha é obrigatória"),
    senhaConfirmacao: yup
        .string()
        .required("Confirmação de senha é obrigatória")
        .when("senha", (senha, schema) => { 
            return  schema.matches(senha, "Confirmação de senha inválida") }),
});

const usuarioValidate = async (data) => {
    return usuarioSchema.validate(data, { abortEarly: false })
        .then(function(value) {
            console.log(value);            

            return {
                status: true,
            }
        })
        .catch(function(err) {
            return {
                status: false,
                message: err.errors,
            }
        });
}

const getAll = async (page = 1, condicao = "", pageSize = 5) => {
    let url = "/usuarios?page=" + page + "&limit=" + pageSize;
    
    for (let field in condicao) {
        if (condicao[field] !== ""){
            url = url + "&" + field + "=" + condicao[field];
        }
    }
    
    const response = await api.get(url);    
    
    return response.data; 
}

const getId = async (id) => {
    const response = await api.get("/usuarios/" + id);

    return response.data; 
}

const removeRecord = async (id) => {
    return await api.delete("/usuarios/" + id, {})
    .then(response => { 
        return { 
            status: (response.status === 200) 
        };
    })
    .catch(error => {
        return { 
            status: false, 
            message: error.response.data.message 
        };
    });      
}

const newRecord = async (data) => {
    return await api.post("/usuarios/", data)
    .then(response => {
        return { 
            status: (response.status === 201),
            data: response.data 
        };
    })
    .catch(error => {
        return { 
            status: false, 
            message: error.response.data.message 
        };
    });  
}

const refreshRecord = async (id, data) => {
    return await api.put("/usuarios/" + id, data)
    .then(response => {
        return { 
            status: (response.status === 200),
            data: response.data 
        };
    })
    .catch(error => {
        return { 
            status: false, 
            message: error.response.data.message 
        };
    });
}

export {
    getAll,
    getId,

    removeRecord,
    newRecord,
    refreshRecord,

    usuarioValidate,
}