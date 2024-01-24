import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function PageContainer({alert, ...props}) {
    const [alertQueue, setAlertQueue] = useState([]);
    const [currAlert, setCurrAlert] = useState(null);
    
    useEffect(() => {
        if (alert) {
            setAlertQueue((oldAlertQueue) => {
                const newAlertQueue = [...oldAlertQueue];
                newAlertQueue.push(alert);
                return newAlertQueue;
            })
        }
    }, [alert]);

    useEffect(() => {
        if (alertQueue.length > 0 && !currAlert) {
            setTimeout(nextAlert, 200);
        }
    }, [alertQueue]);

    const nextAlert = async () => {
        if (alertQueue.length > 0) {
            setCurrAlert(alertQueue[0]);
            setAlertQueue((oldAlertQueue) => {
                const newAlertQueue = [...oldAlertQueue];
                newAlertQueue.shift();
                return newAlertQueue;
            });
            setTimeout(nextAlert, 3000);
        } else {
            setCurrAlert(null);
        }
    }

    return (
        <>
            {currAlert}
            <div style={{padding: "2rem"}}>
                {props.children}
            </div>
        </>
    );
}

export default PageContainer;