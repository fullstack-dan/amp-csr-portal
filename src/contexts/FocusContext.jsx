import React, { createContext, useContext, useState } from "react";

const FocusContext = createContext();

export const FocusProvider = ({ children }) => {
    const [focusedRequest, setFocusedRequest] = useState(null);
    const [focusedUser, setFocusedUser] = useState(null);

    return (
        <FocusContext.Provider
            value={{
                focusedRequest,
                setFocusedRequest,
                focusedUser,
                setFocusedUser,
            }}
        >
            {children}
        </FocusContext.Provider>
    );
};

export const useFocus = () => useContext(FocusContext);
