import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ModalEditarParceiro(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [parceiro, setParceiro] = useState([{}]);

  const { handleSubmit } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const editar = () => {
    BaseAPI.patch("/parceiros/parceiro/" + props.idParceiro + "/", parceiro)
      .then((response) => {
        props.getParceiros();
        handleClose();
        toast.success("Parceiro editado!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar parceiro!", customToastOptions);
      });
  };

  function getParceiro() {
    handleShow();
    BaseAPI.get("/parceiros/parceiro/" + props.idParceiro)
      .then((response) => {
        const { data } = response;
        setParceiro(data);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getParceiro()}
        title="Abrir cadastro do parceiro"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro do parceiro </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(editar)}>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Nome*"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={100}
                    required
                    value={parceiro.nome_parceiro}
                    onChange={(e) =>
                      setParceiro({
                        ...parceiro,
                        nome_parceiro: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Código"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={parceiro.codigo_parceiro}
                    disabled
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Editar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export { ModalEditarParceiro };
export default ModalEditarParceiro;
