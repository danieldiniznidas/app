import api from "../../services/api";
import * as yup from 'yup';

const loginSchema = yup.object().shape({
    usuario: yup
        .string()
        .required("Usuário é obrigatório")
        .email("Usuário deve ser um e-mail"),
    senha: yup
        .string()
        .required("Senha é obrigatória"),
});

const loginValidate = async (data) => {
    return loginSchema.validate(data, {recursive: true})
        .then(function(value) {
            return {
                status: true,
            }
        })
        .catch(function(err) {
            console.log(err);            

            return {
                status: false,
                message: err.errors,
            }
        });
}

const login = async (usuario, senha) => {
    return await api.post("/login", {}, {
        headers: {
            usuario: usuario, 
            senha: senha,
        }
    }).then(response => {
        return { 
            status: (response.status === 200),
            token: response.data.token, 
        };
    })
    .catch(error => {
        return { 
            status: false, 
            message: error.response.data.message,
        };
    });
}

export {
    login,
    loginValidate,
}