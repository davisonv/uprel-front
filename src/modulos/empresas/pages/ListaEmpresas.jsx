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

import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import BaseAPI from "../../../api/BaseAPI";
import ModalCadastrarEmpresa from "../components/ModalCadastrarEmpresa";
import ModalEditarEmpresa from "../components/ModalEditarEmpresa";
import ModalExcluirEmpresa from "../components/ModalExcluirEmpresa";
import RenderIf from "../../../design_system/RenderIf";

function ListaEmpresas() {
  const [empresas, setEmpresas] = useState([{}]);
  const [carregando, setCarregando] = useState(true);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getEmpresas = (values) => {
    setCarregando(true);
    BaseAPI.get("/clientes/lista_empresas/", {
      params: {
        nome: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setEmpresas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const nextPage = () => {
    BaseAPI.get(empresas.next)
      .then((response) => {
        const { data } = response;
        setEmpresas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const previousPage = () => {
    BaseAPI.get(empresas.previous)
      .then((response) => {
        const { data } = response;
        setEmpresas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  useEffect(() => {
    getEmpresas();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cadastro de empresas</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getEmpresas)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome da empresa"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <Button className="mx-1">
              <PersonSearchIcon onClick={handleSubmit(getEmpresas)} />
            </Button>
            <ModalCadastrarEmpresa getEmpresas={getEmpresas} />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead className="text-center">
          <tr>
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            empresas.results.length > 0 &&
            empresas.results.map((empresa) => {
              return (
                <tr key={empresa.id}>
                  <td>{empresa.nome}</td>
                  <td>{empresa.telefone}</td>
                  <td>
                    <Row className="justify-content-center mx-1">
                      <Col sm={2}>
                        <ModalEditarEmpresa
                          idEmpresa={empresa.id}
                          getEmpresas={() => getEmpresas()}
                        />
                      </Col>
                      <Col sm={2}>
                        <ModalExcluirEmpresa
                          idEmpresa={empresa.id}
                          getEmpresas={() => getEmpresas()}
                        />
                      </Col>
                    </Row>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div className="d-flex justify-content-center">
       
        <RenderIf condicao={empresas.previous}>
          <div className="m-1">
            <Button variant="primary" onClick={previousPage}>
              Página Anterior
            </Button>
          </div>
        </RenderIf>

        <RenderIf condicao={empresas.next}>
          <div className="m-1">
            <Button variant="primary" onClick={nextPage}>
              Próxima página
            </Button>
          </div>
        </RenderIf>
        
      </div>
    </Container>
  );
}

export { ListaEmpresas };
export default ListaEmpresas;
