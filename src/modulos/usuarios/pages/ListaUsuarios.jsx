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
import ModalCadastrarUsuario from "../components/ModalCadastrarUsuario";
import ModalEditarUsuario from "../components/ModalEditarUsuario";
import ModalAlterarSenha from "../components/ModalAlterarSenha";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([{}]);
  const [carregando, setCarregando] = useState(true);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getUsuarios = (values) => {
    setCarregando(true);
    BaseAPI.get("/usuarios/lista_usuarios/", {
      params: {
        first_name: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setUsuarios(data.results);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cadastro de usuários</Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getUsuarios)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <Button className="mx-1" onClick={handleSubmit(getUsuarios)}>
              <ManageSearchIcon />
            </Button>
            <ModalCadastrarUsuario getUsuarios={getUsuarios} />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Função</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            usuarios.length > 0 &&
            usuarios.map((usuario) => {
              return (
                <tr key={usuario.id}>
                  <td>{usuario.first_name}</td>
                  <td>{usuario.email}</td>
                  <td>
                    {usuario.funcao === "A"
                      ? "Administrador"
                      : usuario.funcao === "V"
                      ? "Vendedor"
                      : usuario.funcao === "S"
                      ? "Superusuario"
                      : ""}
                  </td>
                  <td>
                    <Row className="w-75">
                      <Col sm={3}>
                        <ModalEditarUsuario
                          idUsuario={usuario.id}
                          getUsuarios={getUsuarios}
                        />
                      </Col>
                      <Col sm={3}>
                        <ModalAlterarSenha
                          idUsuario={usuario.id}
                          getUsuarios={getUsuarios}
                          variant={"warning"}
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

export { ListaUsuarios };
export default ListaUsuarios;
