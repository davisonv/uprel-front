import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BaseAPI from "../../../api/BaseAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ModalCadastrarEmpresa({ getEmpresas }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [carregando, setCarregando] = useState(false);
  const [endereco_cep, setCep] = useState("");
  const [parceiros, setParceiros] = useState([{}]);

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
    if (!dados.nome || !dados.telefone || !dados.cnpj) {
      toast.danger("Preencha os dados obrigatórios !", customToastOptions);
    } else {
      BaseAPI.post("clientes/novo_empresa/", dados)
        .then(() => {
          setCarregando(false);
          handleClose();
          toast.success("Empresa cadastrada!", customToastOptions);
          reset();
          getEmpresas();
        })
        .catch((err) => {
          if (JSON.parse(err.request.response).cnpj) {
            toast.error(
              "Uma empresa com este CNPJ já foi cadastrada!",
              customToastOptions
            );
          } else {
            toast.error("Erro ao cadastrar empresa!", customToastOptions);
          }
        });
    }
  };

  const buscaCep = (event) => {
    const novoCep = event.target.value;
    setCep(novoCep);
    if (novoCep.length === 8) {
      axios
        .get(`https://viacep.com.br/ws/${novoCep}/json`)
        .then((response) => {
          setValue("endereco_rua", response.data.logradouro);
          setValue("endereco_bairro", response.data.bairro);
          setValue("endereco_cidade", response.data.localidade);
          setValue("endereco_uf", response.data.uf);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getParceiros = (values) => {
    setCarregando(true);
    BaseAPI.get("/parceiros/lista_parceiros/")
      .then((response) => {
        const { data } = response;
        setParceiros(data.results);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getParceiros();
  }, []);

  return (
    <>
      <Button variant="success" onClick={handleShow} title="Cadastrar Empresa">
        <PersonAddIcon />
      </Button>
      <Modal show={show} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de empresa </Modal.Title>
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
                    {...register("nome", {
                      required: "Este campo é obrigatório",
                    })}
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
                    {...register("cnpj", {
                      required: "Este campo é obrigatório",
                    })}
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
                    {...register("telefone", {
                      required: "Este campo é obrigatório",
                    })}
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
                    {...register("email", {
                      required: "Este campo é obrigatório",
                    })}
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
                    {...register("endereco_cep")}
                    onChange={buscaCep}
                    value={endereco_cep}
                    id="cepInput"
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
                    {...register("endereco_rua")}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel
                  controlId="floatingInput"
                  label="N°"
                  className="mb-3"
                >
                  <Form.Control type="text" {...register("endereco_numero")} />
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
                    {...register("endereco_bairro")}
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
                    {...register("endereco_cidade")}
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
                    maxLength={256}
                    {...register("endereco_uf")}
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
                  <Form.Control type="text" {...register("descricao")} />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col>
                <FloatingLabel
                  controlId="parceiro"
                  label="Parceiro"
                  className="mb-3"
                >
                  <Form.Select aria-label="Parceiro" {...register("parceiro")}>
                    <option value="">Selecione...</option>
                    {parceiros.length > 0 &&
                      parceiros.map((parceiro) => {
                        return (
                          <option
                            key={parceiro.id_parceiro}
                            value={parceiro.id_parceiro}
                          >
                            {parceiro.nome_parceiro}
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

export { ModalCadastrarEmpresa };
export default ModalCadastrarEmpresa;
