import React from 'react';

export default  ({ children }) => {
    return (
        <div style={{ height: "100%" }}>
            <div style={{ padding: "10px", backgroundColor: "#ffffff", minHeight: "100%", boxShadow: "2px 4px 4px #c6c6c6", borderRadius: "6px" }}>
                {children}
            </div>
        </div>
    )
}