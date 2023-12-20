import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";

import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCadastrarUsuario = ({ getUsuarios }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const cadastrar = (values) => {
    setCarregando(true);

    const dados = {
      ...values,
    };

    if (dados.password != dados.confirmarSenha) {
      toast.error("Senhas divergentes!", customToastOptions);
    } else {
      BaseAPI.post("usuarios/registrar/", dados)
        .then(() => {
          setCarregando(false);
          handleClose();
          toast.success("Usuário cadastrado!", customToastOptions);
          reset();
          getUsuarios();
        })
        .catch((err) => {
          toast.error("Erro ao cadastrar usuário!", customToastOptions);
        });
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Cadastrar Usuário">
        <AssignmentIndIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de usuário </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(cadastrar)}>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput1"
                  label="Nome*"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={150}
                    required
                    {...register("first_name", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput2"
                  label="Usuário*"
                  className="mb-3"
                >
                  <Form.Control
                    autoComplete="false"
                    type="text"
                    maxLength={150}
                    required
                    {...register("username", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput3"
                  label="Email"
                  className="mb-3"
                >
                  <Form.Control type="email" {...register("email")} />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput4"
                  label="Função*"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Função do usuário"
                    required
                    {...register("funcao")}
                  >
                    <option value="">Selecione...</option>
                    <option value="A">Administrador</option>
                    <option value="V">Vendedor</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Senha*"
                  className="mb-3"
                  maxLength="30"
                  required
                  id="senha"
                >
                  <Form.Control
                    type="password"
                    required
                    {...register("password")}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Confirmar senha*"
                  className="mb-3"
                  maxLength="30"
                  required
                  id="confirmarSenha"
                >
                  <Form.Control
                    type="password"
                    required
                    {...register("confirmarSenha")}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Cadastrar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export { ModalCadastrarUsuario };
export default ModalCadastrarUsuario;
