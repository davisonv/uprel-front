import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function BasicCard({modulo, icone, link}) {
  const navigate = useNavigate()
  return (
    <Card sx={{ minWidth: 250 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14}} color="text.secondary" gutterBottom>
          Módulo
        </Typography>
        <Typography variant="h6" component="div">
        {icone} {modulo} 
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          size="small"
          onClick={() => navigate(`${link}`)}
        >
          Acessar
        </Button>
      </CardActions>
    </Card>
  );
}

export {BasicCard}
export default BasicCard