import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import EditIcon from "@mui/icons-material/Edit";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ModalEditarEmpresa(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [empresa, setEmpresa] = useState([{}]);

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
    BaseAPI.patch("/clientes/empresa/" + props.idEmpresa + "/", empresa)
      .then((response) => {
        props.getEmpresas();
        handleClose();
        toast.success("Empresa editada!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao editar empresa!", customToastOptions);
      });
  };

  function getEmpresa() {
    handleShow();
    BaseAPI.get("/clientes/empresa/" + props.idEmpresa)
      .then((response) => {
        const { data } = response;
        setEmpresa(data);
        console.log(empresa);
      })
      .catch((err) => {
        alert(err);
      });
  }

  const [cep, setCep] = useState("");

  const buscaCep = (event) => {
    const novoCep = event.target.value;
    setCep(novoCep);
    if (novoCep.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${novoCep}/json`)
        .then((response) => {
          setEmpresa({
            ...empresa,
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

  return (
    <>
      <Button
        variant="warning"
        onClick={() => getEmpresa()}
        title="Abrir cadastro do empresa"
        className="p-1"
      >
        <EditIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro da empresa </Modal.Title>
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
                    value={empresa.nome}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nome: e.target.value })
                    }
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="CNPJ*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={14}
                    value={empresa.cnpj}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        cnpj: e.target.value,
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
                  label="Telefone*"
                  className="mb-3"
                  required
                >
                  <Form.Control
                    type="text"
                    maxLength={20}
                    value={empresa.telefone}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.email}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_cep}
                    onChange={(e) => {
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_rua}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_numero}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_bairro}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_cidade}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.endereco_uf}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
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
                    value={empresa.descricao}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        descricao: e.target.value,
                      })
                    }
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

export { ModalEditarEmpresa };
export default ModalEditarEmpresa;
