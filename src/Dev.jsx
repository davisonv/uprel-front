import React from 'react'
import { useForm } from "react-hook-form";


import { Input, Button} from './design_system'

function Dev () {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();


      const onSubmit = (data) => {
        alert(JSON.stringify(data));
      };

    return (
        <>
        <Input
            error={errors.username}
            label='Login'
            type='text'
            placeHolder='Digite o seu nome de usuário...'
            register={{...register("username", { required: 'Por favor, preencha este campo' })}}
        />

        <Button onClick={() => handleSubmit(onSubmit)()}>Criar conta</Button>
        </>
    )
}

export default Dev