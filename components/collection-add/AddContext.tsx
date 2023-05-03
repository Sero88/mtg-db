import { SearchCardData } from "@/types/addPage";
import { createContext } from "react";

export const AddContext = createContext({
	searchCallback: (newSearchCardData: SearchCardData) => {},
});
