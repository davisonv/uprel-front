import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";

const ModalLancamentoNegocio = ({ getNegocios }) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);
  const [clientes, setClientes] = useState([{}]);
  const [produtos, setProdutos] = useState([{}]);
  const [usuarios, setUsuarios] = useState([{}]);
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() - 3);
  const dataHoraInicial = currentDate.toISOString().slice(0, 16);
  const [dataHora, setDataHora] = useState(dataHoraInicial);
  const { register, handleSubmit, reset } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const getClientes = () => {
    setCarregando(true);
    BaseAPI.get("/pessoas/lista_clientes/")
      .then((response) => {
        const { data } = response;
        setClientes(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getProdutos = () => {
    setCarregando(true);
    BaseAPI.get("/produtos/lista_produtos/")
      .then((response) => {
        const { data } = response;
        setProdutos(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const getUsuarios = () => {
    setCarregando(true);
    BaseAPI.get("/usuarios/lista_usuarios/")
      .then((response) => {
        const { data } = response;
        setUsuarios(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const lancarNegocio = (values) => {
    setCarregando(true);

    const negocio = {
      ...values,
    };
    console.log(negocio);

    BaseAPI.post("recepcao/novo_negocio/", negocio)
      .then(() => {
        setCarregando(false);
        handleClose();
        toast.success("Negocio Lançado!", customToastOptions);
        reset();
        getNegocios();
      })
      .catch((err) => {
        toast.error("Erro ao lançar negocio!", customToastOptions);
      });
  };

  useEffect(() => {
    getClientes();
    getProdutos();
    getUsuarios();
  }, []);

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Lançar Negócio">
        <PlaylistAddIcon />
      </Button>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        size="lg"
        style={{ zIndex: 1050 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Lançar Negócio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(lancarNegocio)}>
            {" "}
            <Row>
              <Col>
                {" "}
                <FloatingLabel
                  controlId="dataHora"
                  label="Data e hora*"
                  className="mb-3"
                >
                  <Form.Control
                    value={dataHora}
                    onChange={(event) => setDataHora(event.target.value)}
                    type="datetime-local"
                    {...register("data_hora_negocio")}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                {" "}
                <FloatingLabel
                  controlId="clientes"
                  label="Cliente*"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Cliente"
                    required
                    {...register("cliente", {
                      required: "Este campo é obrigatório",
                    })}
                  >
                    <option value=""></option>
                    {clientes.length > 0 &&
                      clientes.map((cliente) => {
                        return (
                          <option key={cliente.value} value={cliente.value}>
                            {cliente.label}
                          </option>
                        );
                      })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Select
                  aria-label="Produto"
                  required
                  multiple
                  {...register("produto", {
                    required: "Este campo é obrigatório",
                  })}
                >
                  <option value="" disabled>
                    Produto
                  </option>
                  {produtos.length > 0 &&
                    produtos.map((produto) => {
                      return (
                        <option
                          key={produto.id_produto}
                          value={produto.id_produto}
                        >
                          {produto.nome_produto}
                        </option>
                      );
                    })}
                </Form.Select>
              </Col>
              <Col>
                {" "}
                <FloatingLabel
                  controlId="profissional"
                  label="Responsável*"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Responsável"
                    required
                    {...register("responsavel", {
                      required: "Este campo é obrigatório",
                    })}
                  >
                    <option value=""></option>
                    {usuarios.length > 0 &&
                      usuarios.map((usuario) => {
                        if (usuario.funcao === "B") {
                          return (
                            <option key={usuario.id} value={usuario.id}>
                              {usuario.first_name}
                            </option>
                          );
                        }
                        return "";
                      })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>
            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Lançar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
};

export { ModalLancamentoNegocio };
export default ModalLancamentoNegocio;
