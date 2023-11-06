import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalCadastrarProduto = ({ getProdutos }) => {
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

    BaseAPI.post("produtos/novo_produto/", dados)
      .then(() => {
        setCarregando(false);
        handleClose();
        toast.success("Produto cadastrado!", customToastOptions);
        getProdutos();
        reset();
      })
      .catch((err) => {
        toast.error("Erro ao cadastrar produto!", customToastOptions);
      });
  };

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Cadastrar Produto">
        <PlaylistAddIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de produto </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(cadastrar)}>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome*"
              className="mb-3"
            >
              <Form.Control
                type="text"
                maxLength={100}
                required
                {...register("nome_produto", {
                  required: "Este campo é obrigatório",
                })}
              />
            </FloatingLabel>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Descrição*"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={100}
                    required
                    {...register("descricao_produto")}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Valor"
                  className="mb-3"
                >
                  <Form.Control
                    type="number"
                    step="0.01"
                    {...register("valor_produto")}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Link (url)"
                  className="mb-3"
                >
                  <Form.Control type="text" {...register("link_produto")} />
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

export { ModalCadastrarProduto };
export default ModalCadastrarProduto;
