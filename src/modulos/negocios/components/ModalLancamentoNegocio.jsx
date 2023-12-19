import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "primereact/resources/themes/lara-light-indigo/theme.css";

const ModalLancamentoNegocio = ({
  getNegocios,
  lancarTarefas,
  novoNegocio,
}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);
  const [clientes, setClientes] = useState([{}]);
  const [produtos, setProdutos] = useState([{}]);
  const [usuarios, setUsuarios] = useState([{}]);
  const [negocio, setNegocio] = useState([{}]);
  const [idNegocio, setIdNegocio] = useState(null);

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
    BaseAPI.get("/clientes/lista_clientes/")
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

    BaseAPI.post("negocios/novo_negocio/", values)
      .then((res) => {
        // setIdNegocio(res.data.id_negocio);
        setNegocio({ ...values, id_negocio: res.data.id_negocio });
        setCarregando(false);
        handleClose();
        toast.success("Negocio Lançado!", customToastOptions);
        novoNegocio({ ...values, id_negocio: res.data.id_negocio });
        reset();
        getNegocios();
        lancarTarefas(true);
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

  useEffect(() => {});

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Lançar Negócio">
        <PlaylistAddIcon />
      </Button>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Lançar Negócio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(lancarNegocio)}>
            <Row>
              <Col>
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
                    <option value="">Selecione...</option>
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
              <Col>
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
                    <option value="">Selecione...</option>
                    {usuarios.length > 0 &&
                      usuarios.map((usuario) => {
                        if (usuario.funcao === "V") {
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
              <Col>
                <FloatingLabel
                  controlId="situacao"
                  label="Situação"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Situação"
                    {...register("situacao", {})}
                  >
                    <option value="">Selecione...</option>
                    <option value="E" style={{ color: "orange" }}>
                      Em andamento
                    </option>
                    <option value="P" style={{ color: "red" }}>
                      Perdido
                    </option>
                    <option value="F" style={{ color: "green" }}>
                      Fechado
                    </option>
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
                <FloatingLabel controlId="etapa" label="Etapa" className="mb-3">
                  <Form.Select aria-label="Etapa" {...register("etapa", {})}>
                    <option value="">Selecione...</option>
                    <option value="PRO">Prospecção</option>
                    <option value="PRE">Pré-cadastro</option>
                    <option value="ASS">Assinatura</option>
                    <option value="EFE">Efetivação</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="nivel_confianca"
                  label="Nível de Confiança"
                  className="mb-3"
                >
                  <Form.Select
                    aria-label="Nível de Confiança"
                    {...register("nivel_confianca", {})}
                  >
                    <option value="">Selecione...</option>
                    <option value="1" className="text-danger">
                      1
                    </option>
                    <option value="2" className="text-danger">
                      2
                    </option>
                    <option value="3" className="text-danger">
                      3
                    </option>
                    <option value="4" className="text-danger">
                      4
                    </option>
                    <option value="5" className="text-warning">
                      5
                    </option>
                    <option value="6" className="text-warning">
                      6
                    </option>
                    <option value="7" className="text-warning">
                      7
                    </option>
                    <option value="8" className="text-success">
                      8
                    </option>
                    <option value="9" className="text-success">
                      9
                    </option>
                    <option value="10" className="text-success">
                      10
                    </option>
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
