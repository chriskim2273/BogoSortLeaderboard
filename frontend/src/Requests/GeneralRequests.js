import axios from "axios";

export const getUserScores = async (amount_of_elements) => {
    await axios.get('http://127.0.0.1:5000/getBestScores?amount_of_elements=' + String(amount_of_elements)).then((response) => {
        return response.data;
    }, (error) => {
        console.log(JSON.stringify(error));
    });
}

