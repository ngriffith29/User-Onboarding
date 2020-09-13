import React, {useState, useEffect} from 'react'
import * as yup from "yup";
import axios from "axios";

const formSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Must include email address"),
  password: yup.string().required("You must type in a password"),
  terms: yup.boolean().oneOf([true], "Please agree to terms of use"),
});

function Form() {






const [formState, setFormState] = useState({
  name: "",
  email: "",
  password: "",
  terms: false,
})

const [errorState, setErrorState] = useState({
  name: "",
  email: "",
  password:"",
  terms: ""
});


const validate = e => {
  let value =
    e.target.type === "checkbox" ? e.target.checked : e.target.value;
  yup
    .reach(formSchema, e.target.name)
    .validate(value)
    .then(valid => {
      setErrorState({
        ...errorState,
        [e.target.name]: ""
      });
    })
    .catch(err => {
      setErrorState({
        ...errorState,
        [e.target.name]: err.errors[0]
      });
    });
};


const [buttonDisabled, setButtonDisabled] = useState(true);
// Everytime formState changes, check to see if it passes verification.
// If it does, then enable the submit button, otherwise disable
useEffect(() => {
  formSchema.isValid(formState).then(valid => {
    setButtonDisabled(!valid);
  });
}, [formState]);


const handleChange = (e) => {
  e.persist();
  // console.log("input changed!", e.target.value, e.target.checked);
  validate(e);


  let value = e.target.type === "checkbox" ? e.target.checked : e.target.value
  setFormState({ ...formState, [e.target.name]: value });


}

const onSubmit = (e)  => {
  e.preventDefault();
  axios
  .post("https://reqres.in/api/users", formState)
  .then(response => console.log(response))
  .catch(err => console.log(err));
}


  return (
    <div>
      <form onSubmit={onSubmit}>
      <label htmlFor="name">
        Type Your Name
        <input name="name" value={formState.name} onChange={handleChange}></input>
      </label>
      {errorState.name.length > 0 ? (
          <p className="error">{errorState.name}</p>
        ) : null}
      <label htmlFor="email">
        Type your email
        <input name="email" value={formState.email} onChange={handleChange}></input>
      </label>
      {errorState.email.length > 0 ? (
          <p className="error">{errorState.email}</p>
        ) : null}
      <label htmlFor="password">
        type your password
        <input  name="password" type="password" value={formState.password} onChange={handleChange}></input>
      </label>
      {errorState.password.length > 0 ? (
          <p className="error">{errorState.password}</p>
        ) : null}
      <label htmlFor="terms">
         Terms of Service
          <input
            name="terms"
            type="checkbox"
            checked={formState.terms}
            onChange={handleChange}
           />
        </label>
        {errorState.terms.length > 0 ? (
          <p className="error">{errorState.terms}</p>
        ) : null}
        <button disabled={buttonDisabled}>Submit</button>
      </form>
    </div>
  )
}

export default Form
