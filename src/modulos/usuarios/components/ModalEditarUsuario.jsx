import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalEditarUsuario(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [usuario, setUsuario] = useState([{}]);

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
    BaseAPI.patch("/usuarios/" + props.idUsuario + "/", usuario)
      .then((response) => {
        props.getUsuarios();
        handleClose();
        toast.success("Usuário editado!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar usuário!", customToastOptions);
      });
  };

  function getUsuario() {
    handleShow();
    BaseAPI.get("/usuarios/" + props.idUsuario)
      .then((response) => {
        const { data } = response;
        setUsuario(data);
        console.log(response);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getUsuario()}
        title="Abrir cadastro do usuário"
        className="p-1"
      >
        <AssignmentIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro do usuário </Modal.Title>
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
                    maxLength={150}
                    required
                    value={usuario.first_name}
                    onChange={(e) =>
                      setUsuario({ ...usuario, first_name: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Usuário"
                  className="mb-3 bg-red"
                >
                  <Form.Control type="text" disabled value={usuario.username} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Email*"
                  className="mb-3"
                >
                  <Form.Control
                    type="email"
                    value={usuario.email}
                    onChange={(e) =>
                      setUsuario({ ...usuario, email: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Função*"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Função do usuário"
                    required
                    value={usuario.funcao}
                    onChange={(e) =>
                      setUsuario({ ...usuario, funcao: e.target.value })
                    }
                  >
                    <option value="A">Administrador</option>
                    <option value="V">Vendedor</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <FloatingLabel
              controlId="floatingInput"
              label="Status*"
              className="mb-3"
            >
              <Form.Select
                aria-label="Status do usuário"
                required
                value={usuario.is_active}
                onChange={(e) =>
                  setUsuario({ ...usuario, is_active: e.target.value })
                }
              >
                <option value="True">Ativo</option>
                <option value="False">Inativo</option>
              </Form.Select>
            </FloatingLabel>

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

export { ModalEditarUsuario };
export default ModalEditarUsuario;
