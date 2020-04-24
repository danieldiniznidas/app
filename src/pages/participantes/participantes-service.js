import api from "../../services/api";

var getAll = async (page = 1, condicao = [], pageSize = 5) => {
    let url = "/participantes?page=" + page + "&limit=" + pageSize;
    
    for (let field in condicao) {
        if (condicao[field] !== ""){
            url = url + "&" + field + "=" + condicao[field];
        }
    }
    
    console.log(url);
    

    const response = await api.get(url);    
    
    return response.data; 
}

var getId = async (id) => {
    const response = await api.get("/participantes/" + id);

    return response.data; 
}

var removeRecord = async (id) => {
    return await api.delete("/participantes/" + id, {})
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

var newRecord = async (data) => {
    return await api.post("/participantes/", data)
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

var refreshRecord = async (id, data) => {
    return await api.post("/participantes/" + id, data)
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
}