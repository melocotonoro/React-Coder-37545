import React,{useContext, useState} from 'react'
import { CartContext } from "../CartContext/CartContex";
import {getFirestore, addDoc, collection, serverTimestamp} from "firebase/firestore"
import "./Form.css"
import InputsForm from '../InputsForm/InputsForm';


const Form=({changeId})=>{

    const[name,setName]=useState("")
    const[lastName,setLastName]=useState("")
    const[mail,setMail]=useState("")
    const[confirmMail,setconfirmMail]=useState("")
    const[phone,setPhone]=useState("")

    const{totalPrice,cart}=useContext(CartContext)

    // Funciones para guardar el nuevo valor ingresado en cada campo
        const handlerName=(e)=>setName(e.target.value)
        const handlerLastName=(e)=>setLastName(e.target.value)
        const handlerMail=(e)=>setMail(e.target.value)
        const handlerMail1=(e)=>setconfirmMail(e.target.value)
        const handlerPhone=(e)=>setPhone(e.target.value)


        //Expresiones para validar datos de los campos del input
        const expression={
            name:/^[a-z A-Z Á-ÿ \s]{2,15}$/,
            lastName:/^[a-z A-Z Á-ÿ \s]{2,15}$/,
            mail:/^[a-z A-Z 0-9 _ . -]+@[a-z A-Z 0-9 -.]+\. [a-z A-Z 0-9-.]+$/,
            phone: /^\d{10}$/
            }

        const handlerSummit=(e)=>{
            e.preventDefault();
                        const newOrder={
                                buyer:{
                                    name,
                                    lastName,
                                    mail,
                                    phone
                                },
                                items:cart.map((element) =>(
                                        {id:element.id,
                                        title:element.title,
                                        price:element.price
                                })),
                                date:serverTimestamp(),
                                total: totalPrice()
                        }

            const db=getFirestore();
            const orderRegister= collection(db,'orders');
            addDoc(orderRegister,newOrder).then((el)=>{
                changeId(el.id);
            })
                .catch(error=> console.log(error)); 
        }

    return(
        <div className='containerForm'>
            <h2>Confirmación de compra</h2>

                <form onSubmit={handlerSummit}>

                    <InputsForm className='containers' label="Nombre" type="text" name="nombre" placeholder= 'Ingresa tu nombre' value={name} error="Incorrecto. No incluyas" error2=" números o símbolos." expresion={expression.name}  onChange={handlerName} />

                    <InputsForm className='containers' label="Apellido" type="text" name="apellido" placeholder= 'Ingresa tu apellido' value={lastName} error="Incorrecto. No incluyas" error2=" números o símbolos." expresion={expression.lastName} onChange={handlerLastName} />

                    <InputsForm className="containerInput" label="Mail" type="email" name="mail" placeholder= 'Ingresa tu mail'  value={mail} error="Incorrecto.El formato de mail es erróneo." error2="" expresion={expression.mail} onChange={handlerMail}/>

                    <InputsForm className="containerInput" label="Confirmar Mail" type="email" name="mail1" placeholder= 'Ingresa nuevamente tu mail'expresion=""  value={confirmMail} error="Incorrecto.No coinciden los mails." error2="" onChange={handlerMail1} />

                    <InputsForm className="containerInput" label="Teléfono" type="number" name="telefono" placeholder= 'Ingresa tu teléfono.No incluyas espacios ni guiones entremedio' value={phone} error="Incorrecto.Formato de 10 dígitos." error2="Característica sin '0' y celulares sin '15'."expresion={expression.phone} onChange={handlerPhone} />

                        {/* Si los campos no están completos el botón esta en estado disabled */}
                        <div>
                            <button className='btnConfirm' disabled={!name|| !lastName || !mail|| !phone}>Confirmar</button>
                        </div>
                </form>
        </div>
    )
}

export default Form
