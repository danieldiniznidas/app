import React from "react";

const authContext = React.createContext(
    { 
        isLooger: false,
        empresa: "Daniel Diniz"
    }
)

export const authProvider = authContext.Provider;
export const authConsumer = authContext.Consumer;

export default authContext