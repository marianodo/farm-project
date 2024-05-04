import { Link, useParams } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";

const NewReport = ({ messageToast }) => {
  const params = useParams();
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/pen?fieldId=${params.id}`)
      .then((response) => {
        console.log(response);
      });

    // messageToast("New Report", "success");
  });

  return (
    <div>
      <h1>New Report</h1>
    </div>
  );
};

export default NewReport;
