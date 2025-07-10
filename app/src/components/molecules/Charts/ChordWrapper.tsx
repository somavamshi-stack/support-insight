import { ChordChart } from "@atoms";
import React from "react";

const sampleData = {
    matrix: [
        [0, 5, 2],
        [5, 0, 3],
        [2, 3, 0]
    ],
    labels: ["Dept A", "Dept B", "Dept C"]
};

const ChordWrapper: React.FC = () => {
    return (
        <div role="region" className="mx-auto bg-transparent">
            <ChordChart matrix={sampleData.matrix} labels={sampleData.labels} />
        </div>
    );
};

export default ChordWrapper;
