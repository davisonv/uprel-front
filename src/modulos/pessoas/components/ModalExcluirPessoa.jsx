import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, Form } from "react-bootstrap";
import BaseAPI from "../../../api/BaseAPI";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

function ModalExcluir(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [pessoa, setPessoa] = useState([{}]);

  const {
    handleSubmit,
  } = useForm();

  const customToastOptions = {
    position: "bottom-right", // Posição onde as notificações serão exibidas
    autoClose: 3000, // Tempo em milissegundos para as notificações fecharem automaticamente
    hideProgressBar: false, // Mostrar barra de progresso de tempo
    pauseOnHover: true, // Pausar o tempo de fechamento ao passar o mouse sobre a notificação
    draggable: true, // Permitir arrastar as notificações
    progress: undefined, // Componente customizado para barra de progresso, caso queira substituir
  };

  const excluir = () => {
    const updatedPessoa = { ...pessoa, status: "I" };
    BaseAPI.patch("/pessoas/pessoa/" + props.idPessoa + "/", updatedPessoa)
      .then((response) => {
        props.getPessoas();
        handleClose();
        toast.success("Pessoa excluída!", customToastOptions);
      })
      .catch((err) => {
        toast.error("Erro ao excluir pessoa!", customToastOptions);
      });
  };

  function getPessoa() {
    handleShow();
    BaseAPI.get("/pessoas/pessoa/" + props.idPessoa)
      .then((response) => {
        const { data } = response;
        setPessoa(data);
        console.log(pessoa);
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <Button
        variant="danger"
        onClick={() => getPessoa()}
        title="Excluir Pessoa"
        className="p-1"
      >
        <DeleteForeverIcon />
      </Button>

      <Modal show={show} onHide={handleClose} centered size="md">
        <Modal.Body>
          <Form onSubmit={handleSubmit(excluir)}>
            <div className="d-flex justify-content-center mb-3">
              <ErrorOutlinedIcon sx={{ fontSize: 100, color: "orange" }} />
            </div>
            <h3 className="text-center">
              Deseja realmente excluir o cliente <strong>{pessoa.nome}</strong>
            </h3>

            <div className="text-center mt-5">
              <Button variant="danger" onClick={handleClose} className="mx-3">
                Cancelar
              </Button>
              <Button variant="success" type="submit" className="mx-3">
                Excluir
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </>
  );
}

export { ModalExcluir };
export default ModalExcluir;
