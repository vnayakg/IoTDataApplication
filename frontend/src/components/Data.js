import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import DataPoint from "../services/dataPoints";

const Data = ({ setRoute }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const [currData, setCurrData] = useState([]);

    useEffect(() => {
        setRoute("/");

        const getData = async () => {
            try {
                const res = await DataPoint.getDataPoints();
                setCurrData(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        getData();
    }, []);

    return (
      currData.length ===0 ?<h1>Loading...</h1>: <DataTable currData={currData} />
    );
};

export default Data;
