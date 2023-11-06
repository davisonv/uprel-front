import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import HttpsIcon from "@mui/icons-material/Https";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalAlterarSenha(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [usuario, setUsuario] = useState([{}]);

  const {
    handleSubmit,
    formState: { errors },
    reset,
    register,
  } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const editar = (values) => {
    const dados = {
      ...values,
    };
    if (dados.password != dados.confirmarSenha) {
      toast.error("Senhas divergentes!", customToastOptions);
    } else {
      BaseAPI.patch("/usuarios/" + props.idUsuario + "/alterar_senha/", {
        password: dados.password,
      })
        .then((response) => {
          console.log("atualizado", response);
          if (props.getUsuarios()) {
            props.getUsuarios();
          }
          handleClose();
          toast.success("Senha alterada!", customToastOptions);
        })
        .catch((err) => {
          toast.error("Erro ao alterar senha!", customToastOptions);
        });
    }
  };

  function getUsuario() {
    handleShow();
    BaseAPI.get("/usuarios/" + props.idUsuario)
      .then((response) => {
        const { data } = response;
        setUsuario(data);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant={props.variant}
        onClick={() => getUsuario()}
        title="Alterar Senha"
        className="p-1"
      >
        <HttpsIcon />
        {props.texto}
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Alterar senha do usuário: {usuario.first_name}{" "}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(editar)}>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput1"
                  label="Senha*"
                  className="mb-3"
                  maxLength="30"
                  required
                  id="senhaAlterar"
                >
                  <Form.Control type="password" {...register("password")} />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput2"
                  label="Confirmar senha*"
                  className="mb-3"
                  maxLength="30"
                  required
                  id="confirmarSenhaAlterar"
                >
                  <Form.Control
                    type="password"
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

export { ModalAlterarSenha };
export default ModalAlterarSenha;
