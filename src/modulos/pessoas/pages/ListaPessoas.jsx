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
import ModalCadastrarPessoa from "../components/ModalCadastrarPessoa";
import ModalEditarPessoa from "../components/ModalEditarPessoa";
import ModalExcluirPessoa from "../components/ModalExcluirPessoa";
import RenderIf from "../../../design_system/RenderIf";
import NextAndPreviousPageAPI from "../../../api/NextAndPreviousPageAPI";

function ListaPessoas() {
  const [pessoas, setPessoas] = useState([{}]);
  const [carregando, setCarregando] = useState(true);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getPessoas = (values) => {
    setCarregando(true);
    BaseAPI.get("/clientes/lista_pessoas/", {
      params: {
        nome: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setPessoas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const nextPage = () => {
    const url = new URL(pessoas.next);
    const path = url.pathname.substring(7) + url.search;
    NextAndPreviousPageAPI.get(path)
      .then((response) => {
        const { data } = response;
        setPessoas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const previousPage = () => {
    const url = new URL(pessoas.previous);
    const path = url.pathname.substring(7) + url.search;
    NextAndPreviousPageAPI.get(path)
      .then((response) => {
        const { data } = response;
        setPessoas(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getPessoas();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cadastro de pessoas</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getPessoas)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome da pessoa"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <Button className="mx-1">
              <PersonSearchIcon onClick={handleSubmit(getPessoas)} />
            </Button>
            <ModalCadastrarPessoa getPessoas={getPessoas} />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead>
          <tr className="text-center">
            <th>Nome</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            pessoas.results.length > 0 &&
            pessoas.results.map((pessoa) => {
              return (
                <tr key={pessoa.id}>
                  <td>{pessoa.nome}</td>
                  <td>{pessoa.telefone}</td>
                  <td>
                    <Row className="justify-content-center mx-1">
                      <Col sm={2}>
                        <ModalEditarPessoa
                          idPessoa={pessoa.id}
                          getPessoas={() => getPessoas()}
                        />
                      </Col>
                      <Col sm={2}>
                        <ModalExcluirPessoa
                          idPessoa={pessoa.id}
                          getPessoas={() => getPessoas()}
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
        <RenderIf condicao={pessoas.previous}>
          <div className="m-1">
            <Button variant="primary" onClick={previousPage}>
              &lt;
            </Button>
          </div>
        </RenderIf>
        <RenderIf condicao={pessoas.next}>
          <div className="m-1">
            <Button variant="primary" onClick={nextPage}>
              &gt;
            </Button>
          </div>
        </RenderIf>
      </div>
    </Container>
  );
}

export { ListaPessoas };
export default ListaPessoas;
