import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ModalEditarPessoa(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pessoa, setPessoa] = useState([{}]);
  const [empresas, setEmpresas] = useState([{}]);

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
    BaseAPI.patch("/clientes/pessoa/" + props.idPessoa + "/", pessoa)
      .then((response) => {
        props.getPessoas();
        handleClose();
        toast.success("Pessoa editada!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar pessoa!", customToastOptions);
      });
  };

  function getPessoa() {
    handleShow();
    BaseAPI.get("/clientes/pessoa/" + props.idPessoa)
      .then((response) => {
        const { data } = response;
        setPessoa(data);
        console.log(pessoa);
      })
      .catch((err) => {
        alert(err);
      });
  }
  const getEmpresas = (values) => {
    BaseAPI.get("/clientes/lista_empresas/", {
      params: {
        nome: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setEmpresas(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const [cep, setCep] = useState("");

  const buscaCep = (event) => {
    const novoCep = event.target.value;
    setCep(novoCep);
    if (novoCep.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${novoCep}/json`)
        .then((response) => {
          setPessoa({
            ...pessoa,
            endereco_cep: novoCep,
            endereco_rua: response.data.logradouro,
            endereco_bairro: response.data.bairro,
            endereco_cidade: response.data.localidade,
            endereco_uf: response.data.uf,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  useEffect(() => {
    getEmpresas();
  }, []);
  return (
    <>
      <Button
        variant="warning"
        onClick={() => getPessoa()}
        title="Abrir cadastro do pessoa"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro da pessoa </Modal.Title>
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
                    value={pessoa.nome}
                    onChange={(e) =>
                      setPessoa({ ...pessoa, nome: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="CPF*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={14}
                    value={pessoa.cpf}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        cpf: e.target.value,
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
                  label="Data de nascimento*"
                  className="mb-3"
                >
                  <Form.Control
                    type="date"
                    required
                    min="1500-01-01"
                    max="9998-12-31"
                    value={pessoa.data_nascimento}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        data_nascimento: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
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
                    value={pessoa.telefone}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
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
                    value={pessoa.email}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
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
                  controlId="cepInput"
                  label="CEP"
                  htmlFor="cepInput"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={8}
                    value={pessoa.endereco_cep}
                    onChange={(e) => {
                      setPessoa({
                        ...pessoa,
                        endereco_cep: e.target.value,
                      });
                      buscaCep(e);
                    }}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Rua"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={256}
                    value={pessoa.endereco_rua}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        endereco_rua: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="N°"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={10}
                    value={pessoa.endereco_numero}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        endereco_numero: e.target.value,
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
                  label="Bairro"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={256}
                    value={pessoa.endereco_bairro}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        endereco_bairro: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Cidade"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={256}
                    value={pessoa.endereco_cidade}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        endereco_cidade: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="UF"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    maxLength={2}
                    value={pessoa.endereco_uf}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        endereco_uf: e.target.value,
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
                    value={pessoa.descricao}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        descricao: e.target.value,
                      })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="empresa"
                  label="Empresa"
                  className="mb-3"
                >
                  <Form.Select
                    type="text"
                    value={pessoa.empresa}
                    onChange={(e) =>
                      setPessoa({
                        ...pessoa,
                        empresa: e.target.value,
                      })
                    }
                  >
                    <option value="">Selecione...</option>
           
                    {empresas.length > 0 &&
                      empresas.map((empresa) => {
                        return (
                          <option key={empresa.id} value={empresa.id}>
                            {empresa.nome}
                          </option>
                        );
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

export { ModalEditarPessoa };
export default ModalEditarPessoa;
