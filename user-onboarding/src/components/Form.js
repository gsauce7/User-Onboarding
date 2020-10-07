import React, { useState, useEffect } from "react";
import * as yup from "yup";
import axios from "axios";

export default function Form() {
  // managing state for our form inputs
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    terms: false
  });

  // server error

  // control whether or not the form can be submitted if there are errors in form validation (in the useEffect)
  const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

  // managing state for errors. empty unless inline validation (validateInput) updates key/value pair to have error
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    terms: ""
  });

  // temporary state used to display response from API. this is not a commonly used convention
  const [post, setPost] = useState([]);

  // inline validation, validating one key/value pair at a time
  const validateChange = (e) => {
    yup
      .reach(formSchema, e.target.name)
      .validate(
        e.target.type === "checkbox" ? e.target.checked : e.target.value
      )
      .then((valid) => {
        // the input is passing!
        // the reset of that input's error
        setErrors({ ...errors, [e.target.name]: "" });
      })
      .catch((err) => {
        // the input is breaking form schema
        console.log("err", err);
        setErrors({ ...errors, [e.target.name]: err.errors[0] });
      });
  };

  // onSubmit function
  const formSubmit = (e) => {
    e.preventDefault();
    axios.post("https://reqres.in/api/users", formState).then((resp) => {
      console.log(resp);
      setPost(resp.data);
      setFormState({
        name: "",
        email: "",
        password: "",
        terms: false
      });
    });
  };

  // onChange function
  const inputChange = (e) => {
    e.persist();
    // e.target.name --> name of the input that fired the event
    // e.target.value --> current value of the input that fired the event
    // e.target.type --> type attribute of the input
    const newFormState = {
      ...formState,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value
    };

    validateChange(e);
    setFormState(newFormState);
  };

  // Add a schema, used for all validation to determine whether the input is valid or not
  const formSchema = yup.object().shape({
    name: yup.string().required("Name is required."),
    email: yup.string().email(),
    password: yup.string().required("Please set a password."),
    terms: yup.boolean().oneOf([true])
  });

  useEffect(() => {
    formSchema.isValid(formState).then((valid) => {
      console.log("is my form valid?", valid);
      setButtonIsDisabled(!valid);
    });
  }, [formState]);

  console.log("formState", formState);
  return (
    <form onSubmit={formSubmit}>
      <label htmlFor="name">
        Name:
        <input
          id="name"
          type="text"
          name="name"
          value={formState.name}
          onChange={inputChange}
        />
        {errors.name.length > 0 ? <p className="error">{errors.name}</p> : null}
      </label>
      <label htmlFor="email">
        Email:
        <input
          id="email"
          type="email"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errors.email.length > 0 ? (
          <p className="error">{errors.email}</p>
        ) : null}
      </label>
      <label htmlFor="password">
        Please set your password.
        <input
          id="password"
          type="password"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errors.password.length > 0 ? (
          <p className="error">{errors.password}</p>
        ) : null}
      </label>
      <label htmlFor="terms" className="terms">
        <input
          type="checkbox"
          id="terms"
          name="terms"
          checked={formState.terms}
          onChange={inputChange}
        />
        I have read the Terms of Service
        {errors.terms.length > 0 ? (
          <p className="error">{errors.terms}</p>
        ) : null}
      </label>
      <button type="submit" disabled={buttonIsDisabled}>
        Submit
      </button>
      <pre>{JSON.stringify(post, null, 2)}</pre>
    </form>
  );
}
