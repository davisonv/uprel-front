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
import ModalCadastrarParceiro from "../components/ModalCadastrarParceiro";
import ModalEditarParceiro from "../components/ModalEditarParceiro";
import ModalExcluirParceiro from "../components/ModalExcluirParceiro";
import RenderIf from "../../../design_system/RenderIf";
import NextAndPreviousPageAPI from "../../../api/NextAndPreviousPageAPI";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ListaParceiros() {
  const [parceiros, setParceiros] = useState([{}]);
  const [carregando, setCarregando] = useState(true);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const getParceiros = (values) => {
    setCarregando(true);
    BaseAPI.get("/parceiros/lista_parceiros/", {
      params: {
        nome_parceiro: values ? values.query : null,
      },
    })
      .then((response) => {
        const { data } = response;
        setParceiros(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const nextPage = () => {
    const url = new URL(parceiros.next);
    const path = url.pathname.substring(7) + url.search;
    NextAndPreviousPageAPI.get(path)
      .then((response) => {
        const { data } = response;
        setParceiros(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };
  const previousPage = () => {
    const url = new URL(parceiros.previous);
    const path = url.pathname.substring(7) + url.search;
    NextAndPreviousPageAPI.get(path)
      .then((response) => {
        const { data } = response;
        setParceiros(data);
        setCarregando(false);
      })
      .catch((err) => {
        alert(err);
      });
  };

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const copiarLink = (codigo) => {
    navigator.clipboard.writeText("http://globomktcorretora.com/cod=" + codigo);
    toast.success("Link copiado!", customToastOptions);
  };

  useEffect(() => {
    getParceiros();
  }, []);

  return (
    <Container>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Cadastro de parceiros </Breadcrumb.Item>
      </Breadcrumb>
      <form onSubmit={handleSubmit(getParceiros)}>
        <Row className="my-4">
          <Col sm>
            <FloatingLabel
              controlId="floatingInput"
              label="Nome do parceiros"
              className="mb-3"
            >
              <Form.Control type="text" {...register("query")} />
            </FloatingLabel>
          </Col>
          <Col sm className="mt-2">
            <Button className="mx-1">
              <PersonSearchIcon onClick={handleSubmit(getParceiros)} />
            </Button>
            <ModalCadastrarParceiro getParceiros={getParceiros} />
          </Col>
        </Row>
      </form>

      <Table striped responsive bordered>
        <thead className="text-center">
          <tr>
            <th>Nome</th>
            <th>Link</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {carregando && <Spinner animation="border" variant="primary" />}
          {!carregando &&
            parceiros.results.length > 0 &&
            parceiros.results.map((parceiro) => {
              return (
                <tr key={parceiro.id_parceiro}>
                  <td>{parceiro.nome_parceiro}</td>
                  <td>
                    http://globomktcorretora.com/cod={parceiro.codigo_parceiro}
                  </td>
                  <td>
                    <Row className="justify-content-center mx-1">
                      <Col sm={2}>
                        <Button className="bg-transparent text-black border-light border-opacity-10">
                          <CopyAllIcon
                            titleAccess="Copiar Link"
                            onClick={() => copiarLink(parceiro.codigo_parceiro)}
                          />
                        </Button>
                      </Col>
                      <Col sm={2}>
                        <ModalEditarParceiro
                          idParceiro={parceiro.id_parceiro}
                          getParceiros={() => getParceiros()}
                        />
                      </Col>
                      <Col sm={2}>
                        <ModalExcluirParceiro
                          idParceiro={parceiro.id_parceiro}
                          getParceiros={() => getParceiros()}
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
        <RenderIf condicao={parceiros.previous}>
          <div className="m-1">
            <Button variant="primary" onClick={previousPage}>
              &lt;
            </Button>
          </div>
        </RenderIf>

        <RenderIf condicao={parceiros.next}>
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

export { ListaParceiros };
export default ListaParceiros;
