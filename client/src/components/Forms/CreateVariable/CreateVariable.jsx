import { useState } from 'react';
import axios from 'axios';

const CreateVariable = () => {
  const [data, setData] = useState({
    name: '',
    type: '',
    parameters: {},
  });
  const [additionalInputs, setAdditionalInputs] = useState([]);

  const handleTypeChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({
      ...prevData,
      type: value,
      parameters: {}, // Limpiamos los parámetros al cambiar el tipo de variable
    }));

    if (value === 'number') {
      setAdditionalInputs([
        {
          id: 0,
          label: 'Valor Mínimo',
          value: '',
          name: 'min',
          typeInput: 'number',
        },
        {
          id: 1,
          label: 'Valor Máximo',
          value: '',
          name: 'max',
          typeInput: 'number',
          min: 0,
          max: 100,
        },
        {
          id: 2,
          label: 'Valor Óptimo Mínimo',
          value: '',
          name: 'optimo_min',
          typeInput: 'number',
          min: 0,
          max: 100,
        },
        {
          id: 3,
          label: 'Valor Óptimo Máximo',
          value: '',
          name: 'optimo_max',
          typeInput: 'number',
          min: 0,
          max: 100,
        },
        {
          id: 4,
          label: 'Granularity',
          value: '',
          name: 'granularity',
          typeInput: 'float',
        },
      ]);
    } else if (value === 'enum') {
      setAdditionalInputs([{ id: 0, label: 'Valor:', value: '' }]);
    } else {
      setAdditionalInputs([]);
    }
  };

  const handleAddInput = () => {
    if (additionalInputs.length < 5) {
      setAdditionalInputs([
        ...additionalInputs,
        {
          id: additionalInputs.length,
          label: 'Valor:',
          value: '',
          typeInput: 'text',
        },
      ]);
    }
  };

  const handleRemoveInput = (id) => {
    if (id !== 0) {
      setAdditionalInputs(additionalInputs.filter((input) => input.id !== id));
    }
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleInputChange = (e, id, value) => {
    // Almacenar prevInputs antes de actualizar el estado

    const updatedInputs = additionalInputs.map((input) =>
      input.id === id ? { ...input, value } : input
    );
    setAdditionalInputs(updatedInputs);

    setData((prevData) => {
      const updatedData = { ...prevData };

      if (prevData.type === 'number') {
        updatedData.parameters = {
          ...prevData.parameters,
          value: {
            min: updatedInputs[0].value,
            max: updatedInputs[1].value,
            optimo_min: updatedInputs[2].value,
            optimo_max: updatedInputs[3].value,
          },
          granularity: updatedInputs[4].value,
        };
      } else if (prevData.type === 'enum') {
        updatedData.parameters = {
          ...prevData.parameters,
          value: updatedInputs.map((input) => input.value),
        };
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/variable`,
        data
      );
      if (response.status === 201) {
        e.target.reset();
        setData([]);
        setAdditionalInputs([]);
      }
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  return (
    <div>
      <form
        id="variableForm"
        className="text-dark fw-bold"
        onSubmit={(e) => handleSubmit(e)}
      >
        <label htmlFor="variableName">Nombre de la Variable:</label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={handleChange}
          required
        />
        <label htmlFor="variableType">Tipo de Variable:</label>
        <select
          defaultValue={'default'}
          id="type"
          name="type"
          required
          onChange={handleTypeChange}
        >
          <option value="default" disabled>
            Seleccione el tipo
          </option>
          <option value="number">Number</option>
          <option value="boolean">Boolean</option>
          <option value="enum">Categorico</option>
        </select>

        {additionalInputs.map((input) => (
          <div key={input.id}>
            <label htmlFor={`additionalInput-${input.id}`}>{input.label}</label>
            <input
              id={`additionalInput-${input.id}`}
              name={`additionalInput-${input.id}`}
              type={input.typeInput}
              value={input.value}
              onChange={(e) => handleInputChange(e, input.id, e.target.value)}
            />
            {data.type === 'enum' && input.id !== 0 && (
              <button type="button" onClick={() => handleRemoveInput(input.id)}>
                Eliminar
              </button>
            )}
          </div>
        ))}

        {data.type === 'enum' && additionalInputs.length < 5 && (
          <button type="button" onClick={handleAddInput}>
            Agregar Input
          </button>
        )}

        <button type="submit">Crear Variable</button>
      </form>
    </div>
  );
};

export default CreateVariable;
