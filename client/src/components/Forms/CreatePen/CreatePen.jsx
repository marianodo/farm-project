import { useState, useEffect } from 'react';
import axios from 'axios';

const CreatePen = () => {
  const [info, setInfo] = useState([]);
  const [data, setData] = useState({});
  const [selectedVariables, setSelectedVariables] = useState([]);

  useEffect(() => {
    const asyncFetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/pen`
        );
        setInfo(response.data);
        // if (response.data.message) alert(response.data.message);
      } catch (error) {
        console.log(error);
      }
    };
    asyncFetchData();
  }, []);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleVariableSelect = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSelectedVariables(selectedOptions);
    setInfo({
      ...info,
    });
  };

  const removeVariable = (variableId) => {
    setSelectedVariables(selectedVariables.filter((id) => id != variableId));
  };

  const renderVariableOptions = () => {
    if (info.variables && info.variables.length > 0) {
      return info.variables.map((variable) => (
        <option key={variable.id} name={variable.name} value={variable.id}>
          {variable.name}
        </option>
      ));
    }
  };
  const renderCustomParameters = () => {
    return selectedVariables.map((variableId) => {
      const variable = info.variables.find(
        (v) => v.id === parseInt(variableId)
      );
      return (
        <div key={variable.id}>
          <label>{variable.name}</label>
          <input
            type="radio"
            name={`variable-${variable.id}`}
            value="true"
            onChange={handleChange}
          />
          <label htmlFor={`variable-${variable.id}-true`}>True</label>
          <input
            type="radio"
            name={`variable-${variable.id}`}
            value="false"
            onChange={handleChange}
          />
          <label htmlFor={`variable-${variable.id}-false`}>False</label>
          <button type="button" onClick={() => removeVariable(variable.id)}>
            X
          </button>
        </div>
      );
    });
  };

  return (
    <form id="penForm" action="/pen" method="POST">
      <label htmlFor="fieldId">Campo:</label>
      <select
        id="fieldId"
        name="field_id"
        defaultValue={'default'}
        onChange={handleChange}
        required
      >
        <option value="default" disabled>
          Seleccione el campo
        </option>
        {info.fields &&
          info.fields.map((field) => (
            <option key={field.id} value={field.id}>
              {field.name}
            </option>
          ))}
      </select>

      <label htmlFor="penName">Nombre del Corral:</label>
      <input
        type="text"
        id="penName"
        name="name"
        onChange={handleChange}
        required
      />

      <label htmlFor="variableSelect">Variables:</label>
      <select
        id="variableSelect"
        name="variableSelect"
        onChange={handleVariableSelect}
        multiple
        required
      >
        {renderVariableOptions()}
      </select>

      <div id="customParametersInputs">{renderCustomParameters()}</div>

      <button type="submit">Crear Corral</button>
    </form>
  );
};

export default CreatePen;
