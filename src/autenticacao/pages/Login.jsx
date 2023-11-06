import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  Col,
  Form,
  FloatingLabel,
  Alert,
  Button,
} from "react-bootstrap";

import BaseAPI from "../../api/BaseAPI";
import { Context } from "../../context/MainContext";

import logo from "../../midia/img/UpRel.png";

function Login() {
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { setAuthenticated } = useContext(Context);

  async function handleLogin(params) {
    setLoading(true);
    await BaseAPI.post("/usuarios/token/", {
      ...params,
    })
      .then((response) => {
        const { data } = response;
        setLoading(false);
        setAuthenticated(true);
        localStorage.setItem("access", JSON.stringify(data.access));
        localStorage.setItem("refresh", JSON.stringify(data.refresh));
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("id", JSON.stringify(data.id));
        localStorage.setItem("authenticated", JSON.stringify(true));
        BaseAPI.defaults.headers.Authorization = `Bearer ${data.access}`;
        navigate("/dashboard");
      })
      .catch((err) => {
        setLoading(false);
        setLoginError(err.request);
      });
  }

  return (
    <Container className="d-flex align-items-center justify-content-center vh-100">
      <Col md={6}>
        <Card>
          <Card.Body>
            <Form onSubmit={handleSubmit(handleLogin)} className="text-center">
              <Col>
                <img
                  src={logo}
                  width="200px"
                  style={{ marginBottom: "32px" }}
                  alt="Logo UpRel"
                />
              </Col>
              <Col xs={12} md={12} className="mb-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Usuário*"
                  className="mb-3"
                >
                  <Form.Control
                    type="text"
                    required
                    error={errors?.username}
                    helperText={errors?.username?.message}
                    id="outlined-required"
                    label="Usuário"
                    {...register("username", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                </FloatingLabel>
              </Col>
              <Col xs={12} md={12} sx={{ marginTop: "16px" }}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Senha*"
                  className="mb-3"
                >
                  <Form.Control
                    type="password"
                    required
                    error={errors?.password}
                    helperText={errors?.password?.message}
                    id="outlined-required"
                    label="Senha"
                    {...register("password", {
                      required: "Este campo é obrigatório",
                    })}
                  />
                </FloatingLabel>
              </Col>
              {!!loginError && loginError.status === 401 && (
                <Col xs={12} md={12} sx={{ marginTop: "16px" }}>
                  <Alert variant="danger">
                    Usuário e/ou senha incorreto(s)
                  </Alert>
                </Col>
              )}
              <Col>
                <Button type="submit">Entrar</Button>
              </Col>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Container>
  );
}

export { Login };
export default Login;
