import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Modal,
  Form,
  FloatingLabel,
  Row,
  Col,
  Tabs,
  Tab,
  Accordion,
} from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

function ModalEditarnegocio(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [negocio, setNegocio] = useState({});
  const [tarefas, setTarefas] = useState([{}]);
  // const [tarefasTemp, setTarefasTemp] = useState([]);
  const [clientes, setClientes] = useState([{}]);
  const [produtos, setProdutos] = useState([{}]);
  const [usuarios, setUsuarios] = useState([{}]);
  const [key, setKey] = useState("editNegocio");
  const [keyTarefas, setKeyTarefas] = useState(0);

  const getClientes = () => {
    BaseAPI.get("/clientes/lista_clientes/")
      .then((response) => {
        const { data } = response;
        setClientes(data);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const getProdutos = () => {
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
    BaseAPI.get("/usuarios/lista_usuarios/", {
      params: {
        is_active: true,
      },
    })
      .then((response) => {
        const { data } = response;
        setUsuarios(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

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

  const editar = () => {
    console.log(negocio);
    BaseAPI.patch("/negocios/negocio/" + props.id_negocio + "/", negocio)
      .then((response) => {
        console.log("atualizado", response);
        props.getNegocios();
        handleClose();
        toast.success("Negócio editado!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar negócio!", customToastOptions);
      });
  };

  const editarTarefa = (idTarefa) => {
    const tarefa =
      tarefas[
        _.findIndex(tarefas, function (tarefas) {
          return tarefas.id_tarefa == idTarefa;
        })
      ];

    BaseAPI.patch("/negocios/tarefa/" + idTarefa + "/", tarefa)
      .then((response) => {
        console.log("atualizado", response);
        props.getNegocios();
        handleClose();
        toast.success("Negócio editado!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar negócio!", customToastOptions);
      });
  };

  const criarTarefa = (values) => {
    values.id_negocio = props.id_negocio;
    values.cliente = negocio.cliente;
    values.responsavel = negocio.responsavel;
    BaseAPI.post("negocios/nova_tarefa/", values)
      .then(() => {
        toast.success("Tarefa Lançada!", customToastOptions);
        reset();
        getTarefas();
      })
      .catch((err) => {
        toast.error("Erro ao lançar tarefa!", customToastOptions);
      });
  };

  function getNegocio() {
    handleShow();
    BaseAPI.get("/negocios/negocio/" + props.id_negocio)
      .then((response) => {
        const { data } = response;
        setNegocio(data);
        getTarefas();
      })
      .catch((err) => {
        alert(err);
      });
  }

  function getTarefas() {
    BaseAPI.get("/negocios/lista_tarefas_negocio/" + props.id_negocio)
      .then((response) => {
        const { data } = response;
        setTarefas(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  }

  useEffect(() => {
    getClientes();
    getProdutos();
    getUsuarios();
  }, []);

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getNegocio()}
        title="Abrir cadastro do negócio"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="xl" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro do negócio </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "400px" }}>
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
          >
            <Tab eventKey="editNegocio" title="Editar Negócio">
              <Form>
                <Row>
                  <Col>
                    <FloatingLabel
                      controlId="dataHoraEdit"
                      label="Data e hora*"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        required
                        value={negocio.data_hora_negocio}
                        onChange={(e) =>
                          setNegocio({
                            ...negocio,
                            data_hora_negocio: e.target.value,
                          })
                        }
                      />
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="clienteEdit"
                      label="Cliente*"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Cliente"
                        required
                        value={negocio.cliente}
                        onChange={(e) =>
                          setNegocio({ ...negocio, cliente: e.target.value })
                        }
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
                      controlId="responsavelEdit"
                      label="Responsável*"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Pessoa"
                        required
                        value={negocio.responsavel}
                        onChange={(e) =>
                          setNegocio({
                            ...negocio,
                            responsavel: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione...</option>
                        {usuarios.length > 0 &&
                          usuarios.map((usuario) => {
                            return (
                              <option key={usuario.id} value={usuario.id}>
                                {usuario.first_name}
                              </option>
                            );
                          })}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  <Col>
                    <FloatingLabel
                      controlId="situacaoEdit"
                      label="Situação"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Situação"
                        required
                        value={negocio.situacao}
                        onChange={(e) =>
                          setNegocio({ ...negocio, situacao: e.target.value })
                        }
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
                      value={negocio.produto}
                      onChange={(e) =>
                        setNegocio({ ...negocio, produto: e.target.value })
                      }
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
                    <FloatingLabel
                      controlId="etapaEdit"
                      label="Etapa"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Etapa"
                        required
                        value={negocio.etapa}
                        onChange={(e) =>
                          setNegocio({ ...negocio, etapa: e.target.value })
                        }
                      >
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
                      controlId="nivel_confiancaEdit"
                      label="Nível de Confiança"
                      className="mb-3"
                    >
                      <Form.Select
                        aria-label="Nível de Confiança"
                        required
                        value={negocio.nivel_confianca}
                        onChange={(e) =>
                          setNegocio({
                            ...negocio,
                            nivel_confianca: e.target.value,
                          })
                        }
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
                  <Button variant="success" onClick={() => editar()}>
                    Editar
                  </Button>
                </Modal.Footer>
              </Form>
            </Tab>
            <Tab eventKey="listagemTarefaEdit" title="Listagem Tarefa">
              {/* Nova Tarefa */}
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Nova Tarefa</Accordion.Header>
                  <Accordion.Body>
                    <Form onSubmit={handleSubmit(criarTarefa)}>
                      <Row>
                        <Col>
                          <FloatingLabel
                            controlId="dataLimiteEdit"
                            label="Data Limite*"
                            className="mb-3"
                          >
                            <Form.Control
                              type="date"
                              required
                              {...register("data_limite", {
                                required: "Este campo é obrigatório",
                              })}
                            />
                          </FloatingLabel>
                        </Col>
                        <Col>
                          <FloatingLabel
                            controlId="tituloEdit"
                            label="Título*"
                            className="mb-3"
                          >
                            <Form.Control
                              type="text"
                              required
                              {...register("titulo", {
                                required: "Este campo é obrigatório",
                              })}
                            />
                          </FloatingLabel>
                        </Col>
                        <Col>
                          <FloatingLabel
                            controlId="statusEdit"
                            label="Status"
                            className="mb-3"
                          >
                            <Form.Select
                              aria-label="Status"
                              required
                              {...register("status", {
                                required: "Este campo é obrigatório",
                              })}
                            >
                              <option value="">Selecione...</option>
                              <option value="A">Ativo</option>
                              <option value="I">Inativo</option>
                            </Form.Select>
                          </FloatingLabel>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <FloatingLabel
                            controlId="descricaoEdit"
                            label="Descrição*"
                            className="mb-3"
                          >
                            <Form.Control
                              as="textarea"
                              required
                              {...register("descricao", {
                                required: "Este campo é obrigatório",
                              })}
                              style={{ height: "100px" }}
                            />
                          </FloatingLabel>
                        </Col>
                      </Row>
                      <Modal.Footer>
                        <Button variant="success" type="submit">
                          Salvar
                        </Button>
                      </Modal.Footer>
                    </Form>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>

              {/* Listagem */}

              {tarefas &&
                tarefas.map((tarefa, index) => {
                  return (
                    <Accordion>
                      <Accordion.Item eventKey="0" key={tarefa.id_tarefa}>
                        <Accordion.Header>{tarefa.titulo}</Accordion.Header>
                        <Accordion.Body>
                          <Form>
                            <Row>
                              <Col>
                                <FloatingLabel
                                  controlId="dataLimiteEdit"
                                  label="Data Limite*"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="date"
                                    required
                                    value={tarefa.data_limite}
                                    onChange={(e) => {
                                      const tarefasTemp = [...tarefas];
                                      tarefasTemp[index].data_limite =
                                        e.target.value;
                                      tarefasTemp[index].touched = true;
                                      setTarefas(tarefasTemp);
                                      setKeyTarefas((prev) => prev + 1);
                                    }}
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col>
                                <FloatingLabel
                                  controlId="tituloEdit"
                                  label="Título*"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    type="text"
                                    required
                                    value={tarefa.titulo}
                                    onChange={(e) => {
                                      const tarefasTemp = [...tarefas];
                                      tarefasTemp[index].titulo =
                                        e.target.value;
                                      tarefasTemp[index].touched = true;
                                      setTarefas(tarefasTemp);
                                      setKeyTarefas((prev) => prev + 1);
                                    }}
                                  />
                                </FloatingLabel>
                              </Col>
                              <Col>
                                <FloatingLabel
                                  controlId="statusEdit"
                                  label="Status"
                                  className="mb-3"
                                >
                                  <Form.Select
                                    aria-label="Status"
                                    required
                                    value={tarefa.status}
                                    onChange={(e) => {
                                      const tarefasTemp = [...tarefas];
                                      tarefasTemp[index].status =
                                        e.target.value;
                                      tarefasTemp[index].touched = true;
                                      setTarefas(tarefasTemp);
                                      setKeyTarefas((prev) => prev + 1);
                                    }}
                                  >
                                    <option value="A">Ativo</option>
                                    <option value="I">Inativo</option>
                                  </Form.Select>
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FloatingLabel
                                  controlId="descricaoEdit"
                                  label="Descrição*"
                                  className="mb-3"
                                >
                                  <Form.Control
                                    as="textarea"
                                    required
                                    value={tarefa.descricao}
                                    onChange={(e) => {
                                      const tarefasTemp = [...tarefas];
                                      tarefasTemp[index].descricao =
                                        e.target.value;
                                      tarefasTemp[index].touched = true;
                                      setTarefas(tarefasTemp);
                                      setKeyTarefas((prev) => prev + 1);
                                    }}
                                    style={{ height: "100px" }}
                                  />
                                </FloatingLabel>
                              </Col>
                            </Row>
                            <Modal.Footer>
                              <Button
                                variant="success"
                                onClick={() => editarTarefa(tarefa.id_tarefa)}
                              >
                                Editar
                              </Button>
                            </Modal.Footer>
                          </Form>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  );
                })}
            </Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export { ModalEditarnegocio };
export default ModalEditarnegocio;
