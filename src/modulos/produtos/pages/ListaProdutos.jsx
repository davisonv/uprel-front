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
import ModalCadastrarProduto from "../components/ModalCadastrarProduto";
import ModalEditarProduto from "../components/ModalEditarProduto";
import ModalExcluirProduto from "../components/ModalExcluirProduto";
import RenderIf from "../../../design_system/RenderIf";

function ListaProdutos() {
  const [produtos, setProdutos] = useState([{}]);
  const [carregando, setCarregando] = useState(true);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getProdutos = (values) => {
    setCarregando(true);
    BaseAPI.get("/produtos/lista_produtos/", {
      params: {
        nome_produto: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setProdutos(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const nextPage = () => {
    BaseAPI.get(produtos.next.replace("http", "https"))
      .then((response) => {
        const { data } = response;
        setProdutos(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const previousPage = () => {
    BaseAPI.get(produtos.previous.replace("http", "https"))
      .then((response) => {
        const { data } = response;
        setProdutos(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getProdutos();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cadastro de produtos</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getProdutos)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Produto"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <Button className="mx-1">
              <ManageSearchIcon onClick={handleSubmit(getProdutos)} />
            </Button>
            <ModalCadastrarProduto getProdutos={getProdutos} />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead>
          <tr className="text-center">
            <th>Nome</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            produtos.results.length > 0 &&
            produtos.results.map((produto) => {
              return (
                <tr key={produto.id_produto}>
                  <td>{produto.nome_produto}</td>
                  <td>{produto.descricao_produto}</td>
                  <td>
                    <Row className="justify-content-center mx-1">
                      <Col sm={3}>
                        <ModalEditarProduto
                          idProduto={produto.id_produto}
                          getProdutos={() => getProdutos()}
                        />
                      </Col>
                      <Col sm={3}>
                        <ModalExcluirProduto
                          idProduto={produto.id_produto}
                          getProdutos={() => getProdutos()}
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
        <RenderIf condicao={produtos.next}>
          <div className="m-1">
            <Button variant="primary" onClick={nextPage}>
              Próxima página
            </Button>
          </div>
        </RenderIf>
        <RenderIf condicao={produtos.previous}>
          <div className="m-1">
            <Button variant="primary" onClick={previousPage}>
              Página Anterior
            </Button>
          </div>
        </RenderIf>
      </div>
    </Container>
  );
}

export { ListaProdutos };
export default ListaProdutos;
