import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
  Tab,
  Tabs,
} from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";

const ModalTarefas = ({ getNegocios, showModal, novoNegocio }) => {
  const [show, setShow] = useState(showModal);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const [key, setKey] = useState("novaTarefa");

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const lancarTarefa = (values) => {
    setCarregando(true);

    const negocio = {
      ...values,
    };
    console.log(novoNegocio);
    negocio.cliente = novoNegocio.cliente;
    negocio.responsavel = novoNegocio.responsavel;
    negocio.id_negocio = novoNegocio.id_negocio;
    console.log(negocio);
    console.log(novoNegocio);

    BaseAPI.post("recepcao/nova_tarefa/", negocio)
      .then(() => {
        setCarregando(false);
        handleClose();
        toast.success("Tarefa Lançada!", customToastOptions);
        reset();
      })
      .catch((err) => {
        toast.error("Erro ao lançar tarefa!", customToastOptions);
      });
  };

  useEffect(() => {}, []);

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow} title="Tarefas">
        Tarefas
      </Button> */}
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Tarefas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="novaTarefa" title="Nova Tarefa">
              <Form onSubmit={handleSubmit(lancarTarefa)}>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="titulo"
                      label="Título*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        aria-label="Título"
                        required
                        {...register("titulo", {
                          required: "Este campo é obrigatório",
                        })}
                      />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="descricao"
                      label="Descrição*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        aria-label="Descrição"
                        required
                        {...register("descricao", {
                          required: "Este campo é obrigatório",
                        })}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="dataLimite"
                      label="Data Limite*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="date"
                        aria-label="Data Limite"
                        required
                        {...register("data_limite", {
                          required: "Este campo é obrigatório",
                        })}
                      />
                    </FloatingLabel>
                  </Col>

                  <Col>
                    <FloatingLabel
                      controlId="status"
                      label="Status*"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Status"
                        required
                        {...register("status", {
                          required: "Este campo é obrigatório",
                        })}
                      >
                        <option value=""></option>
                        <option value="A">Ativo</option>
                        <option value="I">Inativo</option>
                      </Form.Select>
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
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export { ModalTarefas };
export default ModalTarefas;
