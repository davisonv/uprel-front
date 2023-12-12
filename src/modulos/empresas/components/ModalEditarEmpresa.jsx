import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalEditarEmpresa(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [empresa, setEmpresa] = useState([{}]);

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
    BaseAPI.patch("/clientes/empresa/" + props.idEmpresa + "/", empresa)
      .then((response) => {
        props.getEmpresas();
        handleClose();
        toast.success("Empresa editada!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar empresa!", customToastOptions);
      });
  };

  function getEmpresa() {
    handleShow();
    BaseAPI.get("/clientes/empresa/" + props.idEmpresa)
      .then((response) => {
        const { data } = response;
        setEmpresa(data);
        console.log(empresa);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getEmpresa()}
        title="Abrir cadastro do empresa"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro da empresa </Modal.Title>
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
                    value={empresa.nome}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nome: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="CNPJ*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={14}
                    value={empresa.cnpj}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        cnpj: e.target.value,
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
                  label="Telefone*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={20}
                    value={empresa.telefone}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        telefone: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="E-mail*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={100}
                    value={empresa.email}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        email: e.target.value,
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
                  label="Descrição"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    value={empresa.descricao}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        descricao: e.target.value,
                      })
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

export { ModalEditarEmpresa };
export default ModalEditarEmpresa;
