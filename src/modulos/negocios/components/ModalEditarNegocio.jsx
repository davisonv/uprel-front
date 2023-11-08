import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ModalEditarnegocio(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [negocio, setNegocio] = useState({});
  const [clientes, setClientes] = useState([{}]);
  const [produtos, setProdutos] = useState([{}]);
  const [usuarios, setUsuarios] = useState([{}]);

  const getClientes = () => {
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
    BaseAPI.get("/usuarios/lista_usuarios/")
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
    BaseAPI.patch("/recepcao/negocio/" + props.id_negocio + "/", negocio)
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

  function getNegocio() {
    handleShow();
    BaseAPI.get("/recepcao/negocio/" + props.id_negocio)
      .then((response) => {
        const { data } = response;
        setNegocio(data);
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

      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro do negócio </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(editar)}>
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
                    {" "}
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
                      setNegocio({ ...negocio, responsavel: e.target.value })
                    }
                  >
                    {" "}
                    <option value=""></option>
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
            </Row>
            <Row>
              <Col>
                {" "}
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
                    <option value=""></option>
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
                    <option value=""></option>
                    <option value="PRO">Prospecção</option>
                    <option value="PRE">Pré-cadastro</option>
                    <option value="ASS">Assinatura</option>
                    <option value="EFE">Efetivação</option>
                  </Form.Select>
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

export { ModalEditarnegocio };
export default ModalEditarnegocio;
