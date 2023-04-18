import { useQuery } from "react-query";
import axios from "axios";

export function useGetSets() {
	return useQuery("getSets", async () => {
		const endpoint = "/api/scryfall/sets";
		const response = await axios.get(endpoint);
		return response?.data?.data;
	});
}
