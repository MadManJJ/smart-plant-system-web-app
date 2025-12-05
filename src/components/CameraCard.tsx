import { Card } from "./Card";
import { fetchWater } from "../api/plant"; 
import type { SensorData } from "../types/SensorData";

export const CameraCard = ({ isVideoActive, data } : { isVideoActive: boolean, data: SensorData }) => {
    return (
        <div style={{ height: "100%" }}>
            <Card title="Real time monitoring" value="Healthy" color="#10B981" isVideoActive={isVideoActive} buttonOnclick={() => fetchWater(data)} />       
        </div>
    );
};
