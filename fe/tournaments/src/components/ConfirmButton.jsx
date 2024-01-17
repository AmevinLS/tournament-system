import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

function ConfirmButton({confirmText, ...props}) {
    const [showModal, setShowModal] = useState(false);

    const handleButtonClick = () => {
        setShowModal(true);
    }

    const handleNo = () => {
        setShowModal(false);
    };

    const handleYes = () => {
        setShowModal(false);
        props.onClick();
    };

    return (
        <>
            <Button {...props} onHide={handleNo} onClick={handleButtonClick}></Button>
            <Modal show={showModal}>
                <Modal.Header>
                    Confirmation
                </Modal.Header>
                <Modal.Body>{confirmText ? confirmText : "Are you sure?"}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleNo}>No</Button>
                    <Button variant="primary" onClick={handleYes}>Yes</Button>    
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ConfirmButton