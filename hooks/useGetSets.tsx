import { useQuery } from "react-query";
import { ApiCardHelper } from "../util/apiCardHelpers";

export function useGetSets() {
	return useQuery("getSets", () =>
		ApiCardHelper.getAllSets().then((setsList) => {
			return setsList.data;
		})
	);
}
