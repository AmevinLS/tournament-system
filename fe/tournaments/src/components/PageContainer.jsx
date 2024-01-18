import { Outlet } from "react-router-dom";

function PageContainer({...props}) {
    return (
        <div style={{padding: "2rem"}}>
            {props.children}
        </div>
    );
}

export default PageContainer;