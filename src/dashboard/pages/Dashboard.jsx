import React from "react";
import PersonIcon from "@mui/icons-material/Person";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import HandshakeIcon from "@mui/icons-material/Handshake";
import { Card, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  return (
    <Container>
      <Row className="mb-4">
        <Col md={3}>
          <Card onClick={() => navigate("/pessoas")} className="cursor-pointer">
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <PersonIcon /> Cadastro de pessoas
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            onClick={() => navigate("/empresas")}
            className="cursor-pointer"
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <BusinessIcon />
                Cadastro de empresas
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            onClick={() => navigate("/produtos")}
            className="cursor-pointer"
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <RoomServiceIcon /> Cadastro de produtos
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            onClick={() => navigate("/negocios")}
            className="cursor-pointer"
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <WorkIcon /> Negocio
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Card
            onClick={() => navigate("/usuarios")}
            className="cursor-pointer"
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <AssignmentIndIcon /> Cadastro de usuários
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            onClick={() => navigate("/parceiros")}
            className="cursor-pointer"
          >
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted">Módulo</Card.Subtitle>
              <Card.Text>
                <HandshakeIcon /> Cadastro de parceiros
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export { Dashboard };
export default Dashboard;
