import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Breadcrumb,
  Button,
  Container,
  Row,
  Col,
  Table,
  Spinner,
  Form,
  FloatingLabel,
} from "react-bootstrap";

import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BaseAPI from "../../../api/BaseAPI";
import ModalLancamentoNegocio from "../components/ModalLancamentoNegocio";
import ModalEditarnegocio from "../components/ModalEditarNegocio";
import ModalExcluirNegocio from "../components/ModalExcluirNegocio";
import ModalTarefas from "../components/ModalTarefas";

function ListaNegocios() {
  const [negocios, setNegocios] = useState([{}]);
  const [carregando, setCarregando] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [novoNegocio, setNovoNegocio] = useState({});
  const [simOuNao, setSimOuNao] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getNegocios = (values) => {
    setCarregando(true);
    BaseAPI.get("/negocios/lista_negocios/", {
      params: {
        atendente: values ? values.query : null,
      },
    })
      .then((response) => {
        setCarregando(false);
        const { data } = response;
        setNegocios(data.results);
      })
      .catch((err) => {
        alert(err);
      });
  };

  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  useEffect(() => {
    getNegocios();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Negócios</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getNegocios)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Negócio"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <ModalTarefas
              showModal={showModal}
              key={showModal}
              novoNegocio={novoNegocio}
            />
            <Button className="mx-1">
              <ManageSearchIcon onClick={handleSubmit(getNegocios)} />
            </Button>
            <ModalLancamentoNegocio
              getNegocios={getNegocios}
              lancarTarefas={(lancar) => {
                setShowModal(lancar);
              }}
              novoNegocio={(novoNegocio) => setNovoNegocio(novoNegocio)}
            />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead className="text-center">
          <tr>
            <th>Data</th>
            <th>Título</th>
            <th>Pessoa</th>
            <th>Responsável</th>
            <th>Situação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            negocios.length > 0 &&
            negocios.map((negocio) => {
              const dataHoraFormatada = formatDateTime(
                negocio.data_hora_negocio
              );
              return (
                <tr key={negocio.id_negocio}>
                  <td>{dataHoraFormatada}</td>
                  <td>{negocio.titulo}</td>
                  <td>{negocio.cliente_nome}</td>
                  <td>{negocio.responsavel_nome}</td>
                  <td>
                    <div
                      className={
                        "w-75 m-auto " +
                        (negocio.situacao === "E"
                          ? "bg-warning"
                          : negocio.situacao === "P"
                          ? "bg-danger"
                          : "bg-success")
                      }
                      title={
                        negocio.situacao === "E"
                          ? "Em Andamento"
                          : negocio.situacao === "P"
                          ? "Perdido"
                          : "Fechado"
                      }
                    >
                      &nbsp;
                    </div>
                  </td>

                  <td>
                    <Row className="justify-content-center mx-1">
                      <Col sm={4}>
                        <ModalEditarnegocio
                          id_negocio={negocio.id_negocio}
                          getNegocios={() => getNegocios()}
                        />{" "}
                      </Col>
                      <Col sm={4}>
                        <ModalExcluirNegocio
                          idNegocio={negocio.id_negocio}
                          getNegocios={() => getNegocios()}
                        />
                      </Col>
                    </Row>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </Container>
  );
}

export { ListaNegocios };
export default ListaNegocios;
