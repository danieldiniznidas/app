import Cookie from "js-cookie";

class auth {
    IsAuthenticed() {
        return Cookie.get("token") != null;
    } 

    SetToken(token){
        Cookie.set("token", token);
    }
    
    GetToken(){
        return Cookie.get("token") ? Cookie.get("token") : null;
    }

    RemoveToken(){
        Cookie.remove("token");
    }

    RemoveUser(){
        Cookie.remove("usuario");
    }

    SetUser(token){
        Cookie.set("usuario", token);
    }
    
    GetUser(){
        return Cookie.get("usuario") ? Cookie.get("usuario") : null;
    }
}

export default new auth();