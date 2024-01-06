import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalCadastrarParceiro({ getEmpresas }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

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
    if (!dados.nome_parceiro) {
      toast.danger("Preencha os dados obrigatórios !", customToastOptions);
    } else {
      BaseAPI.post("parceiros/novo_parceiro/", dados)
        .then(() => {
          setCarregando(false);
          handleClose();
          toast.success("Parceiro cadastrado!", customToastOptions);
          reset();
        })
        .catch((err) => {
          toast.error("Erro ao cadastrar parceiro!", customToastOptions);
        });
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Cadastrar Parceiro">
        <PersonAddIcon />
      </Button>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de parceiro </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(cadastrar)}>
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
                    {...register("nome_parceiro", {
                      required: "Este campo é obrigatório",
                    })}
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
}

export { ModalCadastrarParceiro };
export default ModalCadastrarParceiro;
