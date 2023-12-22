import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalEditarProduto(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [produto, setProduto] = useState([{}]);

  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const editar = () => {
    BaseAPI.patch("/produtos/produto/" + props.idProduto + "/", produto)
      .then((response) => {
        props.getProdutos();
        handleClose();
        toast.success("Produto editado!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar produto!", customToastOptions);
      });
  };

  function getProduto() {
    handleShow();
    BaseAPI.get("/produtos/produto/" + props.idProduto)
      .then((response) => {
        const { data } = response;
        setProduto(data);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getProduto()}
        title="Abrir cadastro do produto"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro do produto </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(editar)}>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome*"
              className="mb-3"
            >
              <Form.Control
                type="text"
                maxLength={50}
                required
                value={produto.nome_produto}
                onChange={(e) =>
                  setProduto({ ...produto, nome_produto: e.target.value })
                }
              />
            </FloatingLabel>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Descrição"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={100}
                    required
                    value={produto.descricao_produto}
                    onChange={(e) =>
                      setProduto({
                        ...produto,
                        descricao_produto: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Link"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    value={produto.link_produto}
                    onChange={(e) =>
                      setProduto({ ...produto, link_produto: e.target.value })
                    }
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

export { ModalEditarProduto };
export default ModalEditarProduto;
