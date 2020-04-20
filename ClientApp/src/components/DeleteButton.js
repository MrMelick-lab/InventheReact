import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const DeleteButton = (props) => {
    const { buttonLabel, id, label, handleDeleteClick } = props;

    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    return (
        <div>
            <Button color="danger" onClick={toggle}>
                {buttonLabel}
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Suppresion de {label}</ModalHeader>
                <ModalBody>
                    Êtes-vous certain de vouler supprimer le {label} ? La suppression est
          irréversible.
        </ModalBody>
                <ModalFooter>
                    <Button
                        color="danger"
                        onClick={handleDeleteClick}
                        name={`Delete:${id}`}
                    >
                        Supprimer
          </Button>{" "}
                    <Button color="secondary" onClick={toggle}>
                        Annuler
          </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default DeleteButton;
