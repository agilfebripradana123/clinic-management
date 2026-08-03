import api from "./api";

const reportService = {

    async getSummary() {

        const response = await api.get("/reports/summary");

        return response.data;

    }

};

export default reportService;